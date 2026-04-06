/**
 * This will be used to display the current controller's version information
 * in the console log.
 *
 * Currently this is used in our testing environment to help in our debugging.
 * @module
 * @ignore
 */

class DefaultVersionHandler {
   /**
    *  @param {string} serviceName
    *     The name/key of the service.
    */
   constructor(controller) {
      this.controller = controller;
      this.key = `${controller.key}.versioncheck`;

      this.inputValidation = {};
   }

   static keyCheck = /\.versioncheck/;

   /**
    * the Request handler.
    * @param {obj} req
    * @param {fn} cb
    *        a node style callback(err, results) to send data when job is finished
    */
   fn(req, cb) {
      try {
         req.log(`>>> ${this.controller.key} v${this.controller.version}`);
         cb(null, `"${this.controller.version}"`);
      } catch (err) {
         cb(err);
      }
   }
}

module.exports = DefaultVersionHandler;
