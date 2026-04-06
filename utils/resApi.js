/**
 *  * prepare a default set of data/utilities for our api response.
 * @module resApi
 * @ignore
 */
/**
 * @alias ABResponseAPI
 * @typicalname res
 * @param {object} req
 * @param {object} res
 */
class ABResponseAPI {
   constructor(req, res) {
      this.req = req;
      this.res = res;
   }
   /**
    * send an error
    * @param {Error} error
    * @param {number | string} [code=400] response code
    */
   error(err, code) {
      // we don't send .stack data back to clients.
      delete err.stack;

      var packet = {
         status: "error",
         // include jobID on error messages to provide better debugging
         jobID: this.req.jobID || "??",
         data: err.toString?.() ?? {},
      };

      if (err) {
         // add in optional properties: id, message, code, mlKey, errors ...
         var properties = ["id", "message", "code", "mlKey", "errors"];
         properties.forEach(function (prop) {
            if (err[prop]) {
               packet[prop] = err[prop];
            }
         });
      }

      // default to HTTP status code: 400
      if ("undefined" == typeof code) code = 400;

      // if a string was sent as a code, then check to see if
      // a "ENOTFOUND" type of code was accidently sent back:
      // if so, then send a generic 400 error code
      if ("string" == typeof code && code.indexOf("E") != -1) code = 400;

      // Sails v0.11 no longer has res.header on socket connections
      if (this.res.header) this.res.header("Content-type", "application/json");

      var output = JSON.stringify(packet)
         .replace('"false"', "false")
         .replace('"true"', "true");

      this.res.status(code).send(output);

      if (this.req.ab && this.req.ab.performance) {
         this.req.ab.performance.log();
      }
   }

   /** send 401 with a Reauthenticate message */
   reauth() {
      var packet = {
         id: 5,
         message: "Reauthenticate.",
         //            authType: sails.config.appdev.authType
      };

      packet.data = {};
      this.error(packet, 401);
   }

   /**
    * send a success message with data
    * @param {object} data
    * @param {number} [code=200] http response code
    * @param {boolean} [skipHeaders=false]
    */
   success(data, code, skipHeaders) {
      if (typeof skipHeaders == "undefined") {
         skipHeaders = false;
      }

      var packet = {
         status: "success",
         data: data,
      };

      // make sure data is provided.
      if (data) {
         // allow the ability to overwrite the .status value
         if (data.status) {
            packet.status = data.status;
         }
      }

      // default to HTTP status code: 200
      if ("undefined" == typeof code || code == null) code = 200; // 200: assume all is ok

      if (!skipHeaders) {
         // Sails v0.11 no longer has res.header on socket connections
         if (this.res.header)
            this.res.header("Content-type", "application/json");
         // res.send(cJSON.stringify(packet).replace('"false"', 'false').replace('"true"', 'true'), code);
         this.res
            .status(code)
            .send(
               JSON.stringify(packet)
                  .replace('"false"', "false")
                  .replace('"true"', "true"),
            );
      } else {
         this.res.write(
            JSON.stringify(packet)
               .replace('"false"', "false")
               .replace('"true"', "true"),
         );
         this.res.end();
      }

      if (this.req.ab && this.req.ab.performance) {
         this.req.ab.performance.log();
      }
   }
}

/**
 * prepare a default set of data/utilities for our api response.
 * @param {object} req
 * @param {object} res
 * @return {ABResponseAPI}
 */
module.exports = function (...params) {
   return new ABResponseAPI(...params);
};

/*
module.exports = function (req, res) {
   return {
      error: function (err, code) {
         // we don't send .stack data back to clients.
         delete err.stack;

         var packet = {
            status: "error",
            data: err,
         };

         if (err) {
            // add in optional properties: id, message, code, mlKey
            var properties = ["id", "message", "code", "mlKey"];
            properties.forEach(function (prop) {
               if (err[prop]) {
                  packet[prop] = err[prop];
               }
            });
         }

         // default to HTTP status code: 400
         if ("undefined" == typeof code) code = 400;

         // if a string was sent as a code, then check to see if
         // a "ENOTFOUND" type of code was accidently sent back:
         // if so, then send a generic 400 error code
         if ("string" == typeof code && code.indexOf("E") != -1) code = 400;

         // Sails v0.11 no longer has res.header on socket connections
         if (res.header) res.header("Content-type", "application/json");

         var output = JSON.stringify(packet)
            .replace('"false"', "false")
            .replace('"true"', "true");

         res.status(code).send(output);
      },

      reauth: function () {
         var packet = {
            id: 5,
            message: "Reauthenticate.",
            //            authType: sails.config.appdev.authType
         };

         packet.data = {};
         this.error(packet, 401);
      },

      success: function (data, code, skipHeaders) {
         if (typeof skipHeaders == "undefined") {
            skipHeaders = false;
         }

         var packet = {
            status: "success",
            data: data,
         };

         // make sure data is provided.
         if (data) {
            // allow the ability to overwrite the .status value
            if (data.status) {
               packet.status = data.status;
            }
         }

         // default to HTTP status code: 200
         if ("undefined" == typeof code || code == null) code = 200; // 200: assume all is ok

         if (!skipHeaders) {
            // Sails v0.11 no longer has res.header on socket connections
            if (res.header) res.header("Content-type", "application/json");
            // res.send(cJSON.stringify(packet).replace('"false"', 'false').replace('"true"', 'true'), code);
            res.status(code).send(
               JSON.stringify(packet)
                  .replace('"false"', "false")
                  .replace('"true"', "true")
            );
         } else {
            res.write(
               JSON.stringify(packet)
                  .replace('"false"', "false")
                  .replace('"true"', "true")
            );
            res.end();
         }
      },
   };
};
*/
