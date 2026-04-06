const { assert } = require("chai");
const sinon = require("sinon");
const resApi = require("../../utils/resApi.js");

let res;
const sailsRes = {
   send: sinon.fake(),
};
// status() needs to be chainable
sailsRes.status = sinon.fake.returns(sailsRes);

describe("ABResponseAPI", () => {
   beforeEach(() => {
      res = resApi({}, sailsRes);
      sailsRes.send.resetHistory();
      sailsRes.status.resetHistory();
   });

   afterEach(() => {
      sinon.restore();
   });

   describe(".error()", () => {
      it("sends code 400 by default", () => {
         let err = new Error("test");
         let strErr = err.toString(); // Error data is now stringified.
         res.error(err);
         assert(sailsRes.status.calledOnceWith(400));
         assert(sailsRes.send.calledOnce);
         assert.equal(
            sailsRes.send.firstCall.firstArg,
            `{"status":"error","jobID":"??","data":"${strErr}","message":"test"}`,
         );
      });

      it("with ENOTFOUND sends code 400", () => {
         res.error(new Error("test"), "ENOTFOUND");
         assert(sailsRes.status.calledOnceWith(400));
         assert(sailsRes.send.calledOnce);
      });

      it("with 404 sends code 404", () => {
         res.error(new Error("test"), 404);
         assert(sailsRes.status.calledOnceWith(404));
         assert(sailsRes.send.calledOnce);
      });
   });

   describe(".reauth()", () => {
      it("sends 401 with Reauthenticate message", () => {
         res.reauth();
         assert(sailsRes.status.calledOnceWith(401));
         assert(sailsRes.send.calledOnce);
         assert.include(sailsRes.send.firstCall.firstArg, '"Reauthenticate."');
      });
   });

   describe(".success()", () => {
      it("sends 200 by default", () => {
         res.success();
         assert(sailsRes.status.calledOnceWith(200));
         assert(sailsRes.send.calledOnce);
         assert.equal(sailsRes.send.firstCall.firstArg, '{"status":"success"}');
      });

      it("sends json data", () => {
         res.success({ test: "data" });
         assert(sailsRes.status.calledOnceWith(200));
         assert(sailsRes.send.calledOnce);
         assert.equal(
            sailsRes.send.firstCall.firstArg,
            '{"status":"success","data":{"test":"data"}}',
         );
      });

      it("sends a custom response code", () => {
         res.success(undefined, 201);
         assert(sailsRes.status.calledOnceWith(201));
         assert(sailsRes.send.calledOnce);
         assert.equal(sailsRes.send.firstCall.firstArg, '{"status":"success"}');
      });

      it("sends a custom response status", () => {
         res.success({ status: "custom" }, 200);
         assert(sailsRes.status.calledOnceWith(200));
         assert(sailsRes.send.calledOnce);
         assert.include(
            sailsRes.send.firstCall.firstArg,
            '{"status":"custom"}',
         );
      });
   });
});
