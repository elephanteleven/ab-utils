/**
 * Sentry implementation of telemetry
 * @module TelemetrySentry
 * @ignore
 */
const Sentry = require("@sentry/node");
const {
   SentrySpanProcessor,
   SentryPropagator,
} = require("@sentry/opentelemetry-node");

const TelemetryOpenTelemetry = require("./telemetryOtel");

/**
 * @alias telemetrySentry
 * @typicalName telemetry
 */
class TelemetrySentry extends TelemetryOpenTelemetry {
   /**
    * Initialize Sentry
    * @param {Sentry.NodeOptions} options sentry options
    */
   init(options) {
      const defaults = {
         sampleRate: 0.1,
         tracesSampleRate: 0.1,
         profilesSampleRate: 0.1,
         normalizeDepth: 5,
         beforeSendTransaction: (transaction) => {
            // convert open telemetry attribute ("op") to the location sentry expects it
            transaction.contexts.trace.op =
               transaction.contexts.otel?.attributes?.op;
            transaction.spans.forEach((span) => {
               span.op = span.data.op;
               delete span.data.op;
            });
            return transaction;
         },
      };
      const config = Object.assign({}, defaults, options);
      config.instrumenter = "otel";
      Sentry.init(config);
      // Now Intialize Open Telemetry
      super.init({
         name: options.name,
         version: options.release,
         spanProcessor: new SentrySpanProcessor(),
         textMapPropagator: new SentryPropagator(),
      });
   }

   /**
    * Send errors and notifications to sentry
    * @param {object} jobData
    * @param {string} jobData.domain notification domain ('developer' or
    * 'builder')
    * @param {string} jobData.error serrialized error
    * @param {object} jobData.info
    * @param {string} jobData.callStack
    * @param {Error} error the origianl error
    */
   async notify(req, { domain, info, error }, err) {
      const sentryError =
         err instanceof Error
            ? err
            : typeof err == "string"
              ? new Error(err)
              : error;
      /**
       * @const sentryError {Error|string} error to send to sentry
       * If we recieved an Error use that, if we recieved a string
       * ceate an Error from that. For more complex inputs use the
       * result of stringifyErrors.
       */
      Sentry.captureException(sentryError, (scope) => {
         // Consider builder errors as warnings
         if (domain == "builder") scope.setLevel("warning");
         scope.setContext("info", info);
         scope.setUser(info.user);
         scope.setTag("domain", domain);
         scope.setTag("tenant", info?.tenantID);
      });
   }

   /**
    * Provide additional context to Sentry
    * @param {string} key type of context (tags, user, or any other)
    * @param {object} data
    */
   setContext(key, data) {
      switch (key) {
         case "tags":
            Sentry.setTags(data);
            break;
         case "user":
            Sentry.setUser(data);
            break;
         default:
            Sentry.setContext(key, data);
            break;
      }
   }
}

module.exports = TelemetrySentry;
