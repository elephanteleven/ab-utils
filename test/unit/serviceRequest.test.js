const { assert } = require("chai");
const proxyquire = require("proxyquire");
const sinon = require("sinon");

const RequesterFake = sinon.fake();
const ABServiceRequest = proxyquire("../../utils/serviceRequest.js", {
   cote: { Requester: RequesterFake },
});
const serviceRequest = ABServiceRequest();
const notify = sinon.fake();
serviceRequest.req = {
   log: sinon.stub(),
   serviceKey: "test_service",
   notify: { developer: notify },
};

const sendStub = sinon.stub();
/** @const {stub} sendStub - Will be requster.send() for .request() tests */

describe("ServiceRequest tests", () => {
   it(".getRequester() creates a cote Requester", () => {
      serviceRequest.getRequester("test_domain");
      // Call twice to test multiple calls use the same requester
      serviceRequest.getRequester("test_domain");
      assert.equal(RequesterFake.callCount, 1);
      assert(RequesterFake.calledWithNew);
      assert.deepEqual(RequesterFake.firstCall.firstArg, {
         name: "test_service > requester > test_domain",
         key: "test_domain",
         timeout: 5000,
      });
   });

   describe(".request()", () => {
      before(() => {
         sinon.stub(serviceRequest, "getRequester").returns({
            send: sendStub,
         });
      });

      beforeEach(() => {
         sendStub.reset();
         notify.resetHistory();
      });

      it("calls the callback", async () => {
         sendStub.yields(null, { success: true });
         const data = { test: true };
         const callback = sinon.fake();
         await serviceRequest.request("service.test", data, callback);
         // callback works in both positions
         await serviceRequest.request("service.test", data, {}, callback);

         assert.equal(callback.callCount, 2);
         assert.deepEqual(callback.firstCall.args, [null, { success: true }]);
         assert.equal(sendStub.callCount, 2);
         const arg = sendStub.firstCall.firstArg;
         assert.include(arg, {
            __timeout: 5000,
            type: "service.test",
         });
         assert.deepInclude(arg.param, { data });
         assert.containsAllKeys(arg.param, [
            "jobID",
            "requestID",
            "tenantID",
            "user",
            "userReal",
         ]);
      });

      it("calls callback with error", async () => {
         sendStub.yields(new Error("Test Error"));
         const callback = sinon.fake();
         try {
            await serviceRequest.request("service.test", {}, callback);
            // eslint-disable-next-line no-unused-vars
         } catch (e) {
            //expected
         }
         assert.isFalse(
            notify.calledOnce,
            ".notify.developer() not called once",
         );
         assert.equal(callback.callCount, 1);
         assert.instanceOf(callback.firstCall.firstArg, Error);
         assert.include(callback.firstCall.firstArg, {
            message: "Test Error",
         });
      });

      it("returns a promise", async () => {
         sendStub.yields(null, { success: true });
         const data = { test: true };
         const promise = serviceRequest.request("service.test", data);
         assert(promise instanceof Promise);
         const response = await promise;
         assert.deepEqual(response, { success: true });
         assert.equal(sendStub.callCount, 1);
         const arg = sendStub.firstCall.firstArg;
         assert.include(arg, {
            __timeout: 5000,
            type: "service.test",
         });
         assert.deepInclude(arg.param, { data });
         assert.containsAllKeys(arg.param, [
            "jobID",
            "requestID",
            "tenantID",
            "user",
            "userReal",
         ]);
      });

      it("rejects a promise", async () => {
         const err = new Error("Test Error");
         sendStub.yields(err);
         serviceRequest.request("service.test", {}).catch((caught) => {
            assert.deepEqual(caught, err);
         });
      });

      it("retries a timeout", async () => {
         sendStub.yields(new Error("Request timed out."));
         try {
            await serviceRequest.request("service.test", {});
            // eslint-disable-next-line no-unused-vars
         } catch (e) {
            // We expect this
         }
         // 5 Regular attempts + 50 timeouts
         assert.equal(sendStub.callCount, 55);
      });

      it("called with options.maxAttempts", async () => {
         sendStub.yields(new Error("Request timed out."));
         try {
            await serviceRequest.request(
               "service.test",
               {},
               { maxAttempts: 1 },
            );
            // eslint-disable-next-line no-unused-vars
         } catch (e) {
            // We expect this
         }
         // 1 Regular attempt + 50 timeouts
         assert.equal(sendStub.callCount, 51);
      });

      it("called with options.timeout", async () => {
         sendStub.yields();
         await serviceRequest.request("service.test", {}, { timeout: 15000 });
         await serviceRequest.request(
            "service.test",
            {},
            { timeout: 15000, longRequest: true }, // longRequest should be ignored here
         );

         assert.include(sendStub.firstCall.firstArg, { __timeout: 15000 });
         assert.include(sendStub.secondCall.firstArg, { __timeout: 15000 });
      });

      it("called with options.longRequest", async () => {
         sendStub.yields();
         await serviceRequest.request(
            "service.test",
            {},
            { longRequest: true },
         );

         assert.include(sendStub.firstCall.firstArg, {
            __timeout: 90000,
         });
      });

      // Legacy case, needs to work
      it("called with data.longRequest", async () => {
         sendStub.yields();
         await serviceRequest.request("service.test", {
            value: 1,
            longRequest: true,
         });

         assert.include(sendStub.firstCall.firstArg, {
            __timeout: 90000,
         });
         assert.deepInclude(sendStub.firstCall.firstArg.param, {
            data: { value: 1 },
         });
      });

      it("called with options.stringResult", async () => {
         const data = '{"data":"test"}';

         sendStub.yields(null, data);

         let response = await serviceRequest.request(
            "service.test",
            {},
            { stringResult: false },
         );

         assert.deepEqual(response, JSON.parse(data));

         response = await serviceRequest.request(
            "service.test",
            {},
            { stringResult: true },
         );

         assert.equal(response, data);
      });

      it("failed log_manager.notification doesn't call notify", async () => {
         sendStub.yields(new Error("Request timed out."));
         try {
            await serviceRequest.request("log_manager.notification", {
               value: 1,
            });
            // eslint-disable-next-line no-unused-vars
         } catch (e) {
            //expected
         }
         assert(notify.notCalled);
      });
   });
});
