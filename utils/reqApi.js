/**
 * prepare a default set of data/utilities for our api request.
 * This request is established in the Sails api_sails service and is used
 * to verify and send jobs to various micro services.
 * @module reqApi
 * @ignore
 */
const crypto = require("crypto");

function nanoid10() {
   return crypto.randomBytes(10).toString("base64url").slice(0, 10);
}
// const cote = require("cote");

const ABNotification = require("./reqNotification.js");
const ABPerformance = require("./reqPerformance.js");
const ABServicePublish = require("./reqServicePublish.js");
const ABServiceRequest = require("./serviceRequest.js");
const ABServiceResponder = require("./reqServiceResponder.js");
const ABServiceSubscriber = require("./reqServiceSubscriber.js");
const ABValidator = require("./reqValidation.js");
const telemetry = require("./telemetry.js")();
/**
 * @alias ABRequestAPI
 * @typicalname req
 * @classdesc a default set of data/utilities for our api request. This request
 * is established in the Sails api_sails service and is used to verify and send
 * jobs to various micro services.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} [config = {}]
 * @borrows ABNotification#notify as #notify
 * @borrows ABServicePublish#publish as #servicePublish
 * @borrows ABServiceRequest#request as #serviceRequest
 */
class ABRequestAPI {
   constructor(req, res, config = {}) {
      this.jobID = nanoid10();
      // {string}
      // the unique id of this job.  It helps track actions for a particular
      // Job across service calls.

      this._tenantID = "??";
      // {string}
      // which tenant is this request for.

      this._user = null;
      // {json}
      // the SiteUser entry for the user making this request.

      this._userReal = null;
      // {json}
      // the SiteUser entry of the ACTUAL user making this request.
      // this should normally be null, unless the current user is using
      // Switcheroo to impersonate another user.  In that case, ._user
      // is the impersonated user, and ._userReal is really them.

      this.serviceKey = "api_sails";
      // {string}
      // a unique string to identify this service for our service calls.
      // since ABRequestAPI is created on the api_sails service, we can
      // fix that value here.

      // Add context for Sentry
      telemetry.setContext("Job Data", {
         jobID: this.jobID,
         serviceKey: this.serviceKey,
      });
      telemetry.setContext("tags", { tenant: this.tenantID });

      // expose the performance operator directly:
      this.performance = ABPerformance(this);

      // expose these for Unit Testing  & mocking:
      this.__req = req;
      this.__res = res;
      this.__console = console;
      this.__Notification = ABNotification(this);
      this.__Publisher = ABServicePublish(this);
      this.__Requester = ABServiceRequest(this);
      this.__Responder = ABServiceResponder; // Not an instance
      this.__Subscriber = ABServiceSubscriber; // Not an instance
      this.__Validator = ABValidator(this);

      // extend

      /**
       * @method req.log.verbose()
       * A shortcut method for logging "verbose" messages. There needs to be
       * a .verbose = true  in the config.local entry for the current service
       * in order for these messages to be displayed.
       *
       * Now get ready to eat up all kinds of disk space with needless
       * information to the console!
       */
      this.log.verbose = (...params) => {
         if ((config || {}).verbose) {
            this.log(...params);
         }
      };

      /**
       * A shortcut method for notifying builders of configuration errors.
       * @param {Error} error
       * @param {object} [info={}]
       * @kind function
       */
      this.notify.builder = (...params) => {
         this.notify("builder", ...params);
      };

      /**
       * A shortcut method for notifying developer of operational errors.
       * @param {Error} error
       * @param {object} [info={}]
       * @kind function
       */
      this.notify.developer = (...params) => {
         this.notify("developer", ...params);
      };
   }

   /**
    * tenant's id
    * @type {string}
    */
   get tenantID() {
      return this._tenantID;
   }

   /**
    * set the tenantID
    * @kind function
    * @param {string} id tenant's id
    **/
   set tenantID(id) {
      this._tenantID = id;
      telemetry.setContext("tag", { tenant: id });
   }

   /**
    * ABUser
    * @type {obj}
    */
   get user() {
      return this._user;
   }

   /**
    * set the user
    * @kind function
    * @param {object} user ABUser
    **/
   set user(u) {
      this._user = u;
      this.setTelemetryUser();
   }

   /**
    * The actual user when using Switcheroo
    * @type {obj}
    */
   get userReal() {
      return this._userReal;
   }

   /**
    * set the real user
    * @kind function
    * @param {object} user ABUser
    **/
   set userReal(u) {
      this._userReal = u;
      this.setTelemetryUser();
   }

   /** @return {boolean} */
   isSwitcherood() {
      return this._userReal != null;
   }

   /**
    * allow the current user to impersonate the provided user.
    * @param {json:SiteUser} user
    */
   switcherooToUser(u) {
      this.userReal = this.user;
      this.user = u;
      this.setTelemetryUser();
   }

   /**
    * return a data structure used by our ABModel.find() .create() .update()
    * .delete() operations that needs credentials for the current User
    * driving this request.
    * @return {obj}
    *          .languageCode: {string} the default language code of the user
    *          .usernam: {string} the .username of the user for Identification.
    */
   userDefaults() {
      return {
         languageCode: this._user ? this._user.languageCode : "en",
         username: this._user ? this._user.username : "_system_",
      };
   }

   /**
    * @returns {bool} value if the tenantID is set.
    */
   tenantSet() {
      return this.tenantID != "??";
   }

   /**
    * format our output logs to include our jobID with our message.
    * @param {...*} args anything to log (will be stringified)
    */
   log(...allArgs) {
      var args = [];
      allArgs.forEach((a) => {
         let b = a;
         try {
            // FIX: use replacer fn to allow stringify() to handle bigint values:
            // https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
            b = JSON.stringify(a, (k, v) =>
               typeof v === "bigint" ? v.toString() : v,
            );
            // eslint-disable-next-line no-unused-vars
         } catch (e) {
            if (a.toObj) {
               b = JSON.stringify(a.toObj());
            }
         }
         args.push(b);
      });
      // To enhance debugging log files, provide a common timestamp for each line
      // make the ts relative to the common Data.now(), so we are more accurate
      // across different processes.  (other calls like performance.now() are
      // based on the time the process started, not a common UTC time).
      // for logging with fractional seconds
      const now = Date.now();
      const d = new Date(now);
      const fracSecs =
         (now % 1000) / 1000 +
         (typeof performance !== "undefined" && performance.now
            ? (performance.now() % 1) / 1000
            : 0);
      var ts = d
         .toISOString()
         .replace(/\.\d{3}Z$/, "." + fracSecs.toFixed(6).slice(2) + "Z");

      // remove the first portion to keep the time shorter
      ts = ts.split(":");
      ts.shift();
      ts = ts.join(":");
      this.__console.log(`${ts} ${this.jobID}::${args.join(" ")}`);
   }

   notify(domain, error, info) {
      this.__Notification.notify(domain, error, info);
   }

   /**
    * An interface to return the requested input value.
    * If that value has already been processed by our .validateParameters()
    * we pull that value from there.  Otherwise we ask the provided req object
    * for the value.
    * @param {string} key The identifying parameter key
    * @return {string}
    */
   param(key) {
      // return the requested parameter key:

      var value = this.__Validator.param(key);
      if (typeof value == "undefined") {
         value = this.__req.param(key);
      }
      return value;
   }

   servicePublish(key, data) {
      this.__Publisher.publish(key, data);
   }

   serviceRequest(...params) {
      return this.__Requester.request(...params);
   }

   /**
    * Create a Cote service responder that can parse our data interchange
    * format.
    * @param {string} key the service handler's key we are responding to.
    * @param {function} handler a function to handle the incoming request. See
    * {@link ABServiceResponder} constructor for details
    * @returns {ABServiceResponder}
    */
   serviceResponder(key, handler) {
      return this.__Responder(key, handler, this);
   }

   setTelemetryUser() {
      const user = { username: this._user?.username };
      if (this.isSwitcherood()) user.real = this.userReal.username;
      telemetry.setContext("user", user);
   }

   /**
    * Create a Cote service subscriber that can parse our data interchange
    * format.
    * @param {string} key the service handler's key we are responding to.
    * @param {function} handler a function to handle the incoming request. See
    * {@link ABServiceSubscriber} constructor for details
    * @returns {ABServiceSubscriber}
    */
   serviceSubscribe(key, handler) {
      return this.__Subscriber(key, handler, this);
   }

   /**
    * make sure any socket related key is prefixed by our tenantID
    * @param {string} key The socket key we are wanting to reference.
    * @return {string}
    */
   socketKey(key) {
      return `${this._tenantID}-${key}`;
   }

   /**
    * Creates a telemetry child span based on the active span
    * @param {string} key identifier for the span
    * @param {object} attributes any data to add to the span
    * @returns {object} the span
    */
   spanCreateChild(key, attributes) {
      const parent = this.spanRequest();
      return telemetry.startChildSpan(key, attributes, parent);
   }

   /**
    * Creates or gets the telemetry span for the current Request
    * @param {string} key identifier for the span
    * @param {object} attributes any data to add to the span
    * @returns {object} the span
    */
   spanRequest(key, attributes) {
      if (key) {
         this._telemetrySpan = telemetry.startSpan(key, attributes);
      }
      return this._telemetrySpan;
   }

   /**
    * Ends the given telemetry span
    * @param {string} key identifier for the span
    */
   spanEnd(key) {
      telemetry.endSpan(key);
   }

   /**
    * provides a non circular object representation of this reqApi
    * @return {obj}
    */
   toObj() {
      let obj = {};
      ["jobID", "_tenantID", "_user", "_userReal", "serviceKey"].forEach(
         (k) => {
            obj[k] = this[k];
         },
      );
      return obj;
   }

   /**
    * Parse the description object and determine if the current req instance
    * passes the tests provided.
    *
    * Will first use the description to build a joi validator, and then evaluate
    * the parameters using it.
    *
    * Any missed validation rules will be stored internally and an error can be
    * retrieved using .errorValidation().
    * @param {hash} description An object hash describing the validation checks
    * to use. At the top level the Hash is: { [paramName] : {ruleHash} }
    * @param {bool} [autoRespond=true] if true will auto respond on errors with
    * res.ab.error()
    * @param {hash} [params] the parameters to evaluate in the format
    * `{ "param" : {values} }` hash. If not provided, then will use
    * `req.allParams()` to evaluate against all parameters.
    * @return {bool} true if all checks pass, otherwise false.
    * @example <caption> Each {ruleHash} follows this format: </caption>
    *        "parameterName" : {
    *           {joi.fn}  : true,  // performs: joi.{fn}();
    *            {joi.fn} : {
    *              {joi.fn1} : true,   // performs: joi.{fn}().{fn1}();
    *              {joi.fn2} : { options } // performs: joi.{fn}().{fn2}({options})
    *            }
    *            // examples:
    *            "required" : {bool},  // default = false
    *
    *            // custom:
    *            "validate" : {fn} a function(value, {allValues hash}) that
    *                           returns { error:{null || {new Error("Error Message")} }, value: {normalize(value)}}
    *         }
    *
    **/
   validateParameters(description = {}, autoRespond = true, allParams) {
      allParams = allParams || this.__req.allParams();

      // FIX: In some GET requests that are performed outside the socket
      // interface, the querystring values are not being .parsed() for
      // values that should be objects/arrays/numbers.  So we are going to
      // perform a pre-check for those values and attempt to parse them
      Object.keys(description).forEach((k) => {
         let rule = description[k];
         if (rule.object || rule.array || rule.number) {
            if ("string" === typeof allParams[k]) {
               try {
                  allParams[k] = JSON.parse(allParams[k]);
                  // eslint-disable-next-line no-unused-vars
               } catch (e) {
                  /* do nothing */
               }
            }
         }
      });

      this.__Validator.validate(description, allParams);

      var validationError = this.__Validator.errors();
      if (validationError) {
         if (autoRespond) {
            if (this.__res && this.__res.ab && this.__res.ab.error) {
               this.__res.ab.error(validationError);
            } else {
               console.error(validationError);
            }
         }
         return false;
      }
      return true;
   }

   /** @depreciated */
   validationReset() {
      console.error("DEPRECIATED: ?? who is calling this?");
      this.__Validator.reset();
   }

   /**
    * Verify if the current user has one of the provided roleIDs assigned.
    * @param {string[]} roleIDs array containing the uuids of the roles to verify.
    * @return {bool}
    */
   validRoles(roleIDs) {
      if (this._user && this._user.SITE_ROLE) {
         var found = this._user.SITE_ROLE.filter(
            (r) => roleIDs.indexOf(r.uuid ?? r) > -1,
         );
         if (found.length > 0) {
            return true;
         }
      }
      return false;
   }

   /**
    * Verify if the current user has one of the default Builder Roles assigned
    * @param {bool} [autoRespond=true] do we auto res.ab.error() on a negative
    * result see {@link ABRequestAPI#validUser}.
    * @return {bool}
    */
   validBuilder(autoRespond = true) {
      // these are the default Builder & System Designer Roles:
      if (
         !this.validRoles([
            "6cc04894-a61b-4fb5-b3e5-b8c3f78bd331",
            "e1be4d22-1d00-4c34-b205-ef84b8334b19",
         ])
      ) {
         if (autoRespond) {
            var err = new Error("Forbidden.");
            err.id = 6;
            err.code = "E_NOPERM";

            // use our {resAPI} error handler to return the error
            if (this.__res.ab.error) {
               this.__res.ab.error(err, 403);
            } else {
               this.log(err);
            }
         }
         return false;
      }
      return true;
   }

   /**
    * Verify if the current user has the Switcheroo Role assigned
    * @param {bool} [autoRespond=true] do we auto res.ab.error() on a negative
    * result see {@link ABRequestAPI#validUser}.
    * @return {bool}
    */
   validSwitcheroo(autoRespond = true) {
      if (!this.validRoles(["320ef94a-73b5-476e-9db4-c08130c64bb8"])) {
         if (autoRespond) {
            var err = new Error("Forbidden.");
            err.id = 6;
            err.code = "E_NOPERM";

            // use our {resAPI} error handler to return the error
            if (this.__res?.ab?.error) {
               this.__res.ab.error(err, 403);
            } else {
               this.log(err);
            }
         }
         return false;
      }
      return true;
   }

   /**
    * returns `true` if there is a valid .user set on the request, otherwise
    * `false`
    *
    * By default, this function will return a "E_REAUTH" error back as the
    * response.  If you want to externally handle this situation
    * then need to pass `false` for autoRespond.
    * @param {bool} [autoRespond=true] will auto respond on errors with the
    * `res` object.
    * @return {bool}
    **/
   validUser(autoRespond = true) {
      if (!this._user) {
         if (autoRespond) {
            var err = new Error("Reauthenticate.");
            err.id = 5; // v1/legacy value
            err.code = "E_REAUTH";

            // use our {resAPI} error handler to return the error
            if (this.__res && this.__res.ab && this.__res.ab.error) {
               this.__res.ab.error(err);
            } else {
               this.log(err);
            }
         }
         return false;
      }
      return true;
   }
}

/**
 * prepare a default set of data/utilities for our api request.
 * This request is established in the Sails api_sails service and is used
 * to verify and send jobs to various micro services.
 * @param {obj} req
 * @param {obj} res
 * @param {obj} [config = {}]
 * @returns {ABRequestAPI}
 */
module.exports = function (...params) {
   return new ABRequestAPI(...params);
};
