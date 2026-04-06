/**
 * Interface for a telemetry provider;
 * @module telemetry
 * @ignore
 */
const vendorTelemetryClasses = {
   default: require("./telemetryDefault.js"),
   otel: require("./telemetryOtel.js"),
   sentry: require("./telemetrySentry.js"),
};

/**
 * Interface for a telemetry provider;
 * @alias Telemetry
 * @typicalname telemetry
 */
class Telemetry {
   constructor() {
      // If we don't get initialized use the default
      this._telemetry = new vendorTelemetryClasses.default();
   }

   /**
    * Initialize a specefic telemetry provider class
    * @param {string} vendor telemetry provider to use (currently supported: 'sentry')
    * @param {object} config options to initialize with
    */
   init(vendor, config) {
      if (!vendorTelemetryClasses[vendor] || vendor == "default") return;
      this._telemetry = new vendorTelemetryClasses[vendor]();
      this._telemetry.init?.(config);
   }

   /**
    * Call the telemetry provider's notify method to handle errors and messages.
    * @param  {...any} args
    */
   notify(...args) {
      return this._telemetry.notify(...args);
   }

   /**
    * Call the telemetry provider's setContext method (if it exists) to provide
    * additonal data.
    * @param  {...any} args
    */
   setContext(key, data) {
      return this._telemetry.setContext?.(key, data);
   }

   /**
    * Call the telemetry provider's startSpan method (if it exists) to start
    * a tracking Span.
    * @param  {...any} args
    */
   startSpan(...args) {
      return this._telemetry.startSpan?.(...args);
   }

   /**
    * Call the telemetry provider's startChildSpan method (if it exists) to start
    * a tracking Span as child of an existing span.
    * @param  {...any} args
    */
   startChildSpan(...args) {
      return this._telemetry.startChildSpan?.(...args);
   }

   /**
    * Call the telemetry provider's endSpan method (if it exists) to end
    * an ongoing tracking Span.
    * @param  {...any} args
    */
   endSpan(...args) {
      return this._telemetry.endSpan?.(...args);
   }
}
// Singleton
const telemetryInstance = new Telemetry();
/**
 * Get the telemetry interface
 * @returns {Telemetry}
 */
module.exports = () => telemetryInstance;
