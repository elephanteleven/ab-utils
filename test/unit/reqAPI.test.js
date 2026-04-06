const { assert } = require("chai");
const sinon = require("sinon");
const reqApi = require("../../utils/reqApi.js");

let req;

// helper fn returns a mock user object with SITE_ROLEs
const userWithRoles = (roles) => ({
   SITE_ROLE: roles.map((r) => ({ uuid: r })),
});

// Constant roles
const BUILDER_ROLE = "6cc04894-a61b-4fb5-b3e5-b8c3f78bd331";
const SYSTEM_BUILDER_ROLE = "e1be4d22-1d00-4c34-b205-ef84b8334b19";
const SWIRCHEROO_ROLE = "320ef94a-73b5-476e-9db4-c08130c64bb8";

describe("ABRequestAPI", () => {
   beforeEach(() => {
      req = reqApi({}, {});
   });

   afterEach(() => {
      sinon.restore();
   });

   describe("instance attributes", () => {
      it("initializes a default jobID when created", function () {
         assert.exists(req.jobID);
         assert.equal(typeof req.jobID, "string");
      });

      it("properly responds when a tenant is registered", function () {
         assert.isFalse(req.tenantSet());
         req.tenantID = "tenant";
         assert.isTrue(req.tenantSet());
      });
   });

   describe(".log()", () => {
      it("includes .jobID in our console output", () => {
         const log = sinon.replace(req.__console, "log", sinon.fake());
         req.log("test");
         assert(log.calledOnce);
         assert.include(log.firstCall.firstArg, req.jobID);
      });

      it("log.verbose() hidden by default", () => {
         const log = sinon.replace(req.__console, "log", sinon.fake());
         req.log.verbose("test");
         assert(log.notCalled);
      });

      it("log.verbose() shown with config.verbose setting", () => {
         req = reqApi({}, {}, { verbose: true });
         const log = sinon.replace(req.__console, "log", sinon.fake());
         req.log.verbose("test");
         assert(log.calledOnce);
      });
   });

   describe(".serviceRequest()", () => {
      it("calls .__Requester.request", () => {
         const request = sinon.replace(
            req.__Requester,
            "request",
            sinon.fake(),
         );
         const params = ["key", { test: "data" }, { config: "1" }, () => {}];
         req.serviceRequest(...params);
         assert(request.calledOnceWith(...params));
      });
   });

   describe(".notify()", () => {
      let notify;

      beforeEach(() => {
         notify = sinon.replace(req.__Notification, "notify", sinon.fake());
      });

      it("calls .__Notification.notify()", () => {
         const params = ["domain", new Error("test"), {}];
         req.notify(...params);
         assert(notify.calledOnceWith(...params));
      });

      it(".notify.developer() uses developer domain", () => {
         const params = [new Error("test"), {}];
         req.notify.developer(...params);
         assert(notify.calledOnceWith("developer", ...params));
      });

      it(".notify.builder() uses builder domain", () => {
         const params = [new Error("test"), {}];
         req.notify.builder(...params);
         assert(notify.calledOnceWith("builder", ...params));
      });
   });

   describe(".socketKey()", () => {
      it("retuns expected format", () => {
         req.tenantID = "test";
         assert.equal(req.socketKey("key1"), "test-key1");
      });
   });

   describe(".switcherooToUser()", () => {
      it("switches to user", () => {
         const originalUser = { username: "real" };
         const switchedUser = { username: "fake" };
         req.user = originalUser;
         assert.equal(req.user, originalUser);
         assert.isFalse(req.isSwitcherood());
         req.switcherooToUser(switchedUser);
         assert.isTrue(req.isSwitcherood());
         assert.equal(req.user, switchedUser);
         assert.equal(req.userReal, originalUser);
      });
   });

   describe(".validRoles()", () => {
      beforeEach(() => {
         req.user = userWithRoles([
            "d15ed70b-432f-4978-8145-682328559317",
            "6a08a4f8-d73a-41ab-8037-9426599631e7",
         ]);
      });

      it("true when user has the role", () => {
         assert.isTrue(
            req.validRoles(["d15ed70b-432f-4978-8145-682328559317"]),
            "match 1/1",
         );
         // Only one of the roles needs to match
         assert.isTrue(
            req.validRoles(
               [
                  "c3472f93-3da6-4679-bed0-cfda429ce490",
                  "6a08a4f8-d73a-41ab-8037-9426599631e7",
               ],
               "match 1/2",
            ),
         );
      });

      it("false when user does not have role", () => {
         assert.isFalse(
            req.validRoles(["c3472f93-3da6-4679-bed0-cfda429ce490"]),
         );
      });
   });

   describe(".validBuilder()", () => {
      it("true with Builer role", () => {
         req.user = userWithRoles([BUILDER_ROLE]);
         assert.isTrue(req.validBuilder(false));
      });
      it("true with System Builder role", () => {
         req.user = userWithRoles([
            SYSTEM_BUILDER_ROLE,
            "c3472f93-3da6-4679-bed0-cfda429ce490",
         ]);
         assert.isTrue(req.validBuilder(false));
      });
      it("false without a Builder role", () => {
         req.user = userWithRoles(["c3472f93-3da6-4679-bed0-cfda429ce490"]);
         assert.isFalse(req.validBuilder(false));
      });
   });

   describe(".validSwitcheroo()", () => {
      it("true with Switcheroo role", () => {
         req.user = userWithRoles([SWIRCHEROO_ROLE]);
         assert.isTrue(req.validSwitcheroo(false));
      });
      it("false without Switcheroo role", () => {
         req.user = userWithRoles(["c3472f93-3da6-4679-bed0-cfda429ce490"]);
         assert.isFalse(req.validSwitcheroo(false));
      });
   });

   describe(".validUser()", () => {
      it("false when no user", () => assert.isFalse(req.validUser(false)));
      it("true with user", () => {
         req.user = { username: "test" };
         assert.isTrue(req.validUser(false));
      });
   });
});
