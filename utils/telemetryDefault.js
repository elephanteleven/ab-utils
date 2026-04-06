/**
 * Default telemetry class (sends errors to log_manager.notification)
 * @module telemetryDefault
 * @ignore
 */
/**
 * @alias TelemetryDefault
 * @typicalName telemetry
 */
class TelemetryDefault {
   /**
    * Send the error/notification to log_manager.notification
    * @param {ABRequestAPI | ABRequestService} req
    * @param {object} jobData
    * @param {string} jobData.domain notification domain ('developer' or
    * 'builder')
    * @param {string} jobData.error serrialized error
    * @param {object} jobData.info
    * @param {string} jobData.callStack
    */
   async notify(req, jobData) {
      // We need to remove circular data from info, because it get's stringified later
      try {
         JSON.stringify(jobData.info);
         // eslint-disable-next-line no-unused-vars
      } catch (err) {
         // Source: https://stackoverflow.com/questions/11616630/how-can-i-print-a-circular-structure-in-a-json-like-format
         const cache = [];
         const infoStr = JSON.stringify(jobData.info, (key, value) => {
            if (typeof value === "object" && value !== null) {
               // Duplicate reference found, discard key
               if (cache.includes(value)) return;
               // Store value in our collection
               cache.push(value);
            }
            if (typeof value === "bigint") value = value.toString();
            return value;
         });
         jobData.info = JSON.parse(infoStr);
      }

      try {
         await req.serviceRequest("log_manager.notification", jobData);
      } catch (err) {
         req.log("Error posting notification:");
         req.log(err);
      }
   }
}

module.exports = TelemetryDefault;
