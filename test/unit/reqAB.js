/**
 * reqAB
 * test sails rea.ab interface.
 */
var path = require("path");
// var _ = require("lodash");
var expect = require("chai").expect;

// Our service handler:
var REQAB = require(path.join(__dirname, "..", "..", "utils", "reqAB.js"));

describe("reqAB: jobID", function () {
   /*
    * initializes a default jobID when created
    */
   it("initializes a default jobID when created", function () {
      var ab = REQAB({}, {});
      expect(ab.jobID).to.exist;
      expect(typeof ab.jobID).to.equal("string");
   });
});

describe("reqAB: tenantSet", function () {
   /*
    * properly respond when a tenant is registered:
    */
   it("properly respond when a tenant is registered", function () {
      var ab = REQAB({}, {});
      expect(ab.tenantSet()).to.be.false;
      ab.tenantID = "tenant";
      expect(ab.tenantSet()).to.be.true;
   });
});

describe("reqAB: log", function () {
   /*
    * always includes .jobID in our console output:
    */
   it("always includes .jobID in our console output:", function () {
      var ab = REQAB({}, {});
      ab.__console = {
         log: (out) => {
            expect(out).to.contain(ab.jobID);
         },
      };
      ab.log("test");
   });
});

describe("reqAB: toParam", function () {
   /*
    * creates expected format:
    *   {
    *     type: "",
    *     param: {
    *        jobID: "",
    *        tenantID: "",
    *        data: {}
    *     }
    *  };
    */
   it("creates expected format::", function () {
      var ab = REQAB({}, {});
      var param = ab.toParam("key", { value: "here" });
      expect(param).to.exist;
      expect(param).to.be.an("object");
      expect(param).to.have.all.keys("type", "param");
      expect(param.param).to.have.all.keys(
         "jobID",
         "requestID",
         "tenantID",
         "user",
         "data",
      );
      expect(param.param.data.value).to.equal("here");
   });
});

describe("reqAB: validateParameters", function () {
   /*
    * call res.ab.error() if an error is detected && autoRespond == true
    */
   it("call res.ab.error() if an error is detected && autoRespond == true", function () {
      var ab = REQAB(
         {},
         {
            ab: {
               error: (err) => {
                  expect(err).to.exist;
                  expect(err.code).to.equal(422);
                  expect(err.key).to.equal("E_VALIDATION");
               },
            },
         },
      );
      // don't display output
      ab.__console = {
         log: () => {},
      };
      ab.__validationErrors.push({ error: true });
      if (ab.validateParameters({}, true)) {
         // we should not get here on errors:
         expect(true).to.be.false;
      }
   });

   /*
    * Don't call res.ab.error() if an error is detected && autoRespond == false
    */
   it("Don't call res.ab.error() if an error is detected && autoRespond == false", function () {
      var ab = REQAB(
         {},
         {
            ab: {
               error: () => {
                  // this should not be called:
                  expect(true).to.be.false;
               },
            },
         },
      );
      // don't display output
      ab.__console = {
         log: () => {},
      };
      ab.__validationErrors.push({ error: true });
      if (ab.validateParameters({}, false)) {
         // we should not get here on errors:
         expect(true).to.be.false;
      }
   });
});

describe("reqAB: serviceRequest", function () {
   /*
    * should create a new Request on 1st call, but not second
    */
   it("should create a new Request on 1st call, but not second", function () {
      var ab = REQAB({}, {});
      ab.__console = {
         log: () => {},
      };

      // 1st time we expect this to be called:
      ab.__Requester = RequestCalled;
      ab.serviceRequest(
         "service.action",
         { neo: "the one" },
         (/* err, data */) => {},
      );

      // 2nd time => No call
      ab.__Requester = RequestNotCalled;
      ab.serviceRequest(
         "service.action",
         { neo: "the one" },
         (/* err, data */) => {},
      );
   });
});

//
// Helpers
//
class RequestCalled {
   constructor(obj) {
      expect(obj).to.exist;
      expect(obj.key).to.equal("service");
      return {
         send: (param, cb) => {
            cb();
         },
      };
   }
   send(param, cb) {
      cb();
   }
}

class RequestNotCalled {
   constructor(/* obj */) {
      expect(true).to.be.false;
      return {
         send: (param, cb) => {
            cb();
         },
      };
   }
   send(param, cb) {
      cb();
   }
}
