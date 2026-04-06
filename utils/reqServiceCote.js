/// reqServiceCote.js
///
const crypto = require("crypto");

function nanoid10() {
   return crypto.randomBytes(10).toString("base64url").slice(0, 10);
}

/**
 * @class ABServiceCote
 */
class ABServiceCote {
   constructor(req) {
      this.req = req;
   }

   /**
    * toParam()
    * repackage the current data into a common format between our services
    * @param {string} key
    *			The cote request key that identifies which service we are sending
    *			our request to.
    * @param {json} data
    *			The data packet we are providing to the service.
    */
   toParam(key, data) {
      data = data || {};
      return {
         type: key,
         param: {
            jobID: this.req.jobID,
            requestID: nanoid10(),
            tenantID: this.req._tenantID,
            user: this.req._user,
            userReal: this.req._userReal,
            data,
         },
      };
   }
}

module.exports = ABServiceCote;
