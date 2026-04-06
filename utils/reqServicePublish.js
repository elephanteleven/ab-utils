/*
 * reqServicePublish
 * manage publishing a message for other subscribers.
 */
const cote = require("cote");
const ServiceCote = require("./reqServiceCote.js");

var domainPublisher = {
   /* domainKey : cotePublisher */
};
/** @extends ABServiceCote */
class ABServicePublish extends ServiceCote {
   /**
    * Publish an update to other subscribed services.
    * @param {string} key the channel we are updating.
    * @param {json} data the data packet to send to the subscribers.
    */
   publish(key, data) {
      var paramStack = this.toParam(key, data);
      var domain = key.split(".")[0];
      if (!domainPublisher[domain]) {
         this.req.log(`... creating clientPublisher(${domain})`);
         domainPublisher[domain] = new cote.Publisher({
            name: `${this.req.serviceKey} > publisher > ${domain}`,
            key: domain,
         });
      }
      this.req.log(`... publishing (${domain})->${key} `);
      domainPublisher[domain].publish(key, paramStack);
   }
}

module.exports = function (...params) {
   return new ABServicePublish(...params);
};
