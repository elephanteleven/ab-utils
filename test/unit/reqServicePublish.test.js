const { assert } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const cotePublisher = {
   publish: sinon.fake(),
};
const cotePublisherConstructor = sinon.fake.returns(cotePublisher);

const servicePublish = proxyquire("../../utils/reqServicePublish.js", {
   cote: {
      Publisher: cotePublisherConstructor,
   },
});

describe("ABServicePublish", () => {
   describe(".publish()", () => {
      it("creates a cote publisher and publishes", () => {
         const abPublisher = servicePublish({
            serviceKey: "service",
            log: () => {},
         });
         const toParam = sinon.replace(
            abPublisher,
            "toParam",
            sinon.fake.returns({ paramStack: "fake" }),
         );
         abPublisher.publish("domain.key", {});
         // 2nd call should reuse the existing Cote Publisher
         abPublisher.publish("domain.key", {});
         assert(cotePublisherConstructor.calledOnce);
         assert(cotePublisherConstructor.calledWithNew);
         assert.deepEqual(cotePublisherConstructor.firstCall.firstArg, {
            key: "domain",
            name: "service > publisher > domain",
         });
         assert(toParam.calledTwice);
         assert(cotePublisher.publish.calledTwice);
         const [key, paramStack] = cotePublisher.publish.firstCall.args;
         assert.equal(key, "domain.key");
         assert.deepEqual(paramStack, { paramStack: "fake" });
      });
   });
});
