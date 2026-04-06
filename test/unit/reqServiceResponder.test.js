const { assert } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const coteResponder = {
   on: sinon.fake(),
};
const coteResponderConstructor = sinon.fake.returns(coteResponder);

const serviceResponder = proxyquire("../../utils/reqServiceResponder.js", {
   cote: {
      Responder: coteResponderConstructor,
   },
});

describe("ABServiceResponder", () => {
   it("creates a cote responder", () => {
      const req = {
         serviceKey: "service",
         log: () => {},
      };
      const handler = sinon.fake();
      serviceResponder("domain.key", handler, req);
      serviceResponder("domain.key", handler, req);

      assert(coteResponderConstructor.calledOnce);
      assert(coteResponderConstructor.calledWithNew);
      assert.deepEqual(coteResponderConstructor.firstCall.firstArg, {
         key: "domain",
         name: "domain",
      });
      assert(coteResponder.on.calledTwice);
      assert.equal(coteResponder.on.firstCall.args[0], "domain.key");
   });
});
