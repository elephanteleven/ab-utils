// reqPerformance
// Track Performance timings for the {reqAPI | reqService} object.

const prettyTime = require("pretty-time");

class ABRequestPerformance {
   constructor(req) {
      this.req = req;
      // {reqAPI || reqService}
      // the calling request object that is trying to validate it's values.

      this.marks = {
         /* key : BigInt(timestamp) */
      };
      // {hash}
      // a collection of all our relevant timestamps.

      this.measures = {
         /* key : BigInt(timestamp) */
      };
      // {hash}
      // a collection of all our desired measured time spans. These are
      // the time differences between our .marks

      this.mark("__start");
   }

   /**
    * toLegacyFormat()
    * convert the provided duration in BigInt format to the legacy
    * process.hrtime() format:  [ #sec, #remainingMicroseconds ]
    * @param {BigInt} duration
    *       The duration as a BigInt
    */
   toLegacyFormat(duration) {
      var numSeconds = Math.floor(Number(duration / BigInt(1000000000)));
      var remaining = Number(duration % BigInt(1000000000));

      return [numSeconds, remaining];
   }

   /**
    * log()
    * dump one or more measurements to the req.log().  If some measurements
    * are provided, then just print out one for each of those.  Otherwise
    * perform a full summary dump of all the current measurements.
    * @param {string[]} measures
    *       (optional) an array of the specific measurement keys to print out.
    */
   log(measures) {
      if (measures) {
         if (!Array.isArray(measures)) {
            measures = [measures];
         }
         measures.forEach((m) => {
            if (this.measures[m]) {
               var mFormat = this.toLegacyFormat(this.measures[m]);
               this.req.log(`${m}: ${prettyTime(mFormat)}`);
            } else {
               this.req.log(`${m}: ?? unknown measurement key [${m}]`);
            }
         });
         return;
      }
      // if no measures are provided, then dump all the measurements
      Object.keys(this.measures).forEach((k) => {
         var lFormat = this.toLegacyFormat(this.measures[k]);
         this.req.log(`${k}: ${prettyTime(lFormat)}`);
      });

      // and perform a total response time measure:
      var durTotal = this.toLegacyFormat(
         this.measure("__totalTime", "__start"),
      );
      this.req.log(`response time: ${prettyTime(durTotal)}`);
   }

   /**
    * mark()
    * capture the current process.hrtime.bigint() and store it under key.
    * @param {string} key a unique reference for this timing.
    * @param {object} attributes optional attribute to pass on to telemetry
    */
   mark(key, attributes) {
      if (key) {
         if (this.marks[key]) {
            this.req.log(
               `PREVENTING performance.mark() from overwriting existing key [${key}]`,
            );
            // in practice, we usually are wanting the existing key, so let's not overwrite it
            return;
         }
         this.marks[key] = process.hrtime.bigint();
         // Start a telemetry span
         if (key !== "__start") this.req.spanCreateChild?.(key, attributes);
      }
   }

   /**
    * measure()
    * measure the performance difference and save the diff under {key}.
    *
    * Can be called 3 ways:
    *   1: measure({key}) : returns duration from mark[key] to now.
    *   2: measure({key}, {mark.key}) : returns duration from mark.key to now
    *   3: measure({key}, {mark.key.from}, {mark.key.to})
    *
    * @param {string} key
    *		a unique identifier for this measurement.
    * @param {string} keyFrom
    *		the starting mark to measure from
    * @param {string} keyTo
    *		{optional} the ending mark to measure to.  If none provided, then
    *		we measure to now.
    * @return {bigint} microseconds difference
    */
   measure(key, keyFrom, keyTo = null) {
      if (!keyFrom) {
         keyFrom = key;
      }
      // End the telemetry span;
      if (!keyTo) this.req.spanEnd(keyFrom);
      var timeFrom = this.marks[keyFrom];
      var timeTo = this.marks[keyTo] || process.hrtime.bigint();

      return (this.measures[key] = timeTo - timeFrom);
   }
}

module.exports = function (...params) {
   return new ABRequestPerformance(...params);
};
