/**
 * Used by TelemetrySentry. Could be adapted in the future to work with other
 * vendors.
 * @module TelemetryOpenTelemetry
 * @ignore
 */

const opentelemetry = require("@opentelemetry/sdk-node");
const otelApi = require("@opentelemetry/api");
const {
   OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");

const TelemetryDefault = require("./telemetryDefault");

/**
 * @alias TelemetryOpenTelemetry
 * @typicalName
 */
class TelemetryOpenTelemetry extends TelemetryDefault {
   constructor() {
      super();
      this.spans = {};
   }

   /**
    * @init
    * @param {object} config
    * @param {opentelemetry.node.SpanProcessor} config.spanProcessor
    * @param { opentelemetry.api.TextMapPropagator} config.textMapPropagator
    * @param {string} config.name name to use for the Tracer
    * @param {string} config.version version to use for the Tracer
    */
   init(config) {
      const sdk = new opentelemetry.NodeSDK({
         traceExporter: new OTLPTraceExporter(),
         spanProcessor: config.spanProcessor,
         textMapPropagator: config.textMapPropagator,
      });
      sdk.start();
      this._tracer = otelApi.trace.getTracer(config.name, config.version);
   }

   /**
    * Start an open telemetry span
    * @param {string} key unique identifier
    * @param {object} attributes extra attributes to add the span
    * @returns {opentelemetry.api.Span}
    */
   startSpan(key, attributes) {
      this.spans[key] = this._tracer.startSpan(key, { attributes });
      otelApi.trace.setSpan(otelApi.context.active(), this.spans[key]);
      return this.spans[key];
   }

   /**
    * Start an open telemetry span as a child of an existing span
    * @param {string} key unique identifier
    * @param {object} attributes extra attributes to add the span
    * @param {opentelemetry.api.Span} [parent] the parent span
    * @returns {opentelemetry.api.Span}
    */
   startChildSpan(key, attributes, parent) {
      const activeContext = otelApi.context.active();
      const context = parent
         ? otelApi.trace.setSpan(activeContext, parent)
         : activeContext;
      this.spans[key] = this._tracer.startSpan(key, { attributes }, context);
      return this.spans[key];
   }

   /**
    * End the given span
    * @param {string} key unique identifier
    */
   endSpan(key) {
      this.spans[key]?.end?.();
      delete this.spans[key];
   }
}
module.exports = TelemetryOpenTelemetry;
