const assert = require("assert");
const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

class DBFake {
   on() {}
}
const createPoolFake = sinon.stub().callsFake(() => new DBFake());
const dbConn = proxyquire("../../utils/dbConn.js", {
   mysql: {
      createPool: createPoolFake,
   },
});
const reqFake = {
   configDB: sinon.fake.returns({}),
};

describe("dbConn", () => {
   it("creates a DB Conection once", () => {
      const one = dbConn(reqFake);
      const two = dbConn(reqFake);
      assert.equal(reqFake.configDB.callCount, 1);
      assert.equal(createPoolFake.callCount, 1);
      assert.equal(one, two);
   });
   it("creates a isolated DB Conection", () => {
      const one = dbConn(reqFake);
      const two = dbConn(reqFake, true, true);
      assert.equal(reqFake.configDB.callCount, 2);
      assert.equal(createPoolFake.callCount, 2);
      assert.notEqual(one, two);
   });
});
