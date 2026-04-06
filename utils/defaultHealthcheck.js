/**
 * This will be used to create the default healthcheck request handler for
 * each AB service. It can be overridden by manually adding a *.healthcheck
 * handler to the service.
 * @module
 * @ignore
 */

class DefaultHealthcheck {
   /**
    *  @param {string} serviceName
    *     The name/key of the service.
    */
   constructor(controller) {
      this.key = `${controller.key}.healthcheck`;
      this.inputValidation = {};
   }

   static keyCheck = /\.healthcheck$/;

   /**
    * the Request handler.
    * @param {obj} req
    * @param {fn} cb
    *        a node style callback(err, results) to send data when job is finished
    */
   fn(req, cb) {
      try {
         req.log(`${this.key}: default`);
         cb(null, "OK");
      } catch (err) {
         cb(err);
      }
   }
}

module.exports = DefaultHealthcheck;
