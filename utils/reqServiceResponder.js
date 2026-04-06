// reqServiceResponder.js
/**
 * manage the responses to a ServiceRequest.
 */
const cote = require("cote");

const { serializeError /*, deserializeError */ } = require("serialize-error");

var domainResponder = {
   /* domainKey : coteResponder */
};

/**
 * manage the responses to a ServiceRequest.
 * @param {string} key the service handler's key we are responding to.
 * @param {function} handler a function to handle the incoming request. The
 * function will receive 2 parameters: fn(req, cb)
 * <br> req: an instance of the ABRequest appropriate for the current context.
 * <br> cb:  a node.js style callback(err, result) for responding to the
 * requester.
 * @param {object} req
 */
class ABServiceResponder {
   constructor(key, handler, req) {
      this.key = key;
      this.handler = handler;
      this.req = req;

      var domainKey = key.split(".")[0];
      if (!domainResponder[domainKey]) {
         domainResponder[domainKey] = new cote.Responder({
            name: domainKey,
            key: domainKey,
         });
      }

      domainResponder[domainKey].on(key, (data, cb) => {
         var packet = data.param;

         var abReq = null;
         if (this.req.controller) {
            // make an instance of reqService
            abReq = new this.req.constructor(packet, this.req.controller);
         } else {
            // make an instance of reqApi
            abReq = new this.req.constructor(null, null);
            abReq.jobID = packet.jobID;
            abReq.tenantID = packet.tenantID;
            abReq._user = packet.user;
            abReq._userReal = packet.userReal;

            abReq._data = packet.data || packet.param;

            abReq.param = (key) => {
               if (key) {
                  return abReq._data[key];
               }
               return abReq._data;
            };
         }

         abReq.log(`ServiceResponder::${key}`);
         abReq.performance.mark(key);
         this.handler(abReq, (err, response) => {
            // TODO: any additional error procesing here?
            if (err) {
               err = serializeError(err);
            }

            abReq.performance.measure(key);
            abReq.performance.log(key);
            cb(err, response);
         });
      });
   }
}

module.exports = function (...params) {
   return new ABServiceResponder(...params);
};
