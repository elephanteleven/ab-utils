/**
 * Subscribe to a Publisher's message stream.
 */

const cote = require("cote");

var domainSubscriber = {
   /* domainKey : coteSubscriber */
};

/**
 * Subscribe to a Publisher's message stream.
 * @param {string} key
 * @param {?} handler
 * @param {object} req
 */
class ABServiceSubscriber {
   constructor(key, handler, req) {
      this.key = key;
      this.handler = handler;
      this.req = req;

      var domainKey = key.split(".")[0];
      if (!domainSubscriber[domainKey]) {
         domainSubscriber[domainKey] = new cote.Subscriber({
            name: `${this.req.serviceKey || "api_sails"} > subscriber > ${key}`,
            key: domainKey,
         });
      }

      domainSubscriber[domainKey].on(key, (data) => {
         var packet = data.param;

         var abReq = null;
         if (this.req.controller) {
            // make an instance of reqService
            abReq = new this.req.constructor(packet, this.req.controller);
         } else {
            // abReq = RequestAPI(null, null);
            abReq = new this.req.constructor(null, null);
            abReq.jobID = packet.jobID;
            abReq.tenantID = packet.tenantID;
            abReq._user = packet.user;

            abReq._data = packet.data || packet.param;

            abReq.param = (key) => {
               if (key) {
                  return abReq._data[key];
               }
               return abReq._data;
            };
         }

         abReq.log(`ServiceSubscriber::${key}`);

         this.handler(abReq);
      });
   }
}

module.exports = function (...params) {
   return new ABServiceSubscriber(...params);
};
