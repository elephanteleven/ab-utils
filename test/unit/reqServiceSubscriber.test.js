const { assert } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const coteSubscriber = {
   on: sinon.fake(),
};
const coteSubscriberConstructor = sinon.fake.returns(coteSubscriber);

const serviceSubscriber = proxyquire("../../utils/reqServiceSubscriber.js", {
   cote: {
      Subscriber: coteSubscriberConstructor,
   },
});

describe("ABServiceSubscriber", () => {
   it("creates a cote subscriber", () => {
      const req = {
         serviceKey: "service",
         log: () => {},
      };
      const handler = sinon.fake();
      serviceSubscriber("domain.key", handler, req);
      serviceSubscriber("domain.key", handler, req);

      assert(coteSubscriberConstructor.calledOnce);
      assert(coteSubscriberConstructor.calledWithNew);
      assert.deepEqual(coteSubscriberConstructor.firstCall.firstArg, {
         key: "domain",
         name: "service > subscriber > domain.key",
      });
      assert(coteSubscriber.on.calledTwice);
      assert.equal(coteSubscriber.on.firstCall.args[0], "domain.key");
   });
});
