const assert = require("assert");
const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

const pathJoinFake = sinon.fake.returns("fakePath");
const config = proxyquire("../../utils/config.js", {
   path: { join: pathJoinFake },
   fakePath: { one: { example: "config" } },
});

describe("config", () => {
   it("returns a config", () => {
      const one = config("one");
      const two = config();
      assert.deepEqual(one, { example: "config" });
      assert.deepEqual(two, { one: { example: "config" } });
      assert.equal(pathJoinFake.callCount, 2);
      assert.equal(pathJoinFake.firstCall.args[2], "local.js");
      assert.equal(pathJoinFake.secondCall.args[2], "local.js");
   });
});
