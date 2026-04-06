// reqValidation.js

var Joi = null;
const NODE_MAJOR_VERSION = process.versions.node.split(".")[0];
if (NODE_MAJOR_VERSION >= 12) {
   Joi = require("joi");
}

const _ = require("lodash");

var validators = {
   /* key : Joi.object() */
};

class ABRequestValidation {
   constructor(req) {
      this.req = req;
      // {reqAPI || reqService}
      // the calling request object that is trying to validate it's values.

      this.reset();
   }

   reset() {
      this.__validationErrors = [];
      this.__validationParamsNormalized = {};
   }

   /**
    * errors()
    * return any validation errors repackaged into an Error object.
    * @return {Error | undefined}
    */
   errors() {
      if (this.__validationErrors.length > 0) {
         this.__validationErrors.forEach((e) => {
            e.details.forEach((d) => {
               this.req.log(
                  `... validation error [${this.req.jobID}]: ${d.message} (${
                     d.context.label
                  } : ${JSON.stringify(d.context.value)})`,
               );
            });
         });
         // this.req.log("... validation errors:", this.__validationErrors);

         var error = new Error("Validation Errors");
         error.key = "E_VALIDATION";
         error.validationErrors = JSON.stringify(this.__validationErrors);
         error.code = 422; // RFC 7231 now proposes 400 as better code.
         return error;
      }
   }

   /**
    * param()
    * An interface to return the requested input value.
    * If that value has already been processed by our .validateParameters()
    * we pull that value from there.  Otherwise we ask the provided req object
    * for the value.
    * @param {string} key
    *       The identifying parameter key
    * @return {various}
    */
   param(key) {
      // return the requested parameter key:

      // if we have already done .validateParameters() then we might have
      // some normalized values processed.  Return those if we have 'em:
      if (
         this.__validationParamsNormalized &&
         typeof this.__validationParamsNormalized[key] != "undefined"
      ) {
         return this.__validationParamsNormalized[key];
      }

      // otherwise we return undefined:
   }

   /**
    * @method validate()
    * parse the {description} object and determine if the current req
    * instance passes the tests provided.
    *
    * This fn() will first use the {description} to build a joi
    * validator, and then evaluate the parameters using it.
    *
    * Any missed validation rules will be stored internally and an
    * error can be retrieved using .errorValidation().
    *
    * This fn() returns {true} if all checks pass, or {false} otherwise.
    * @param {hash} description
    *        An object hash describing the validation checks to use. At
    *        the top level the Hash is: { [paramName] : {ruleHash} }
    *        Each {ruleHash} follows this format:
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
    * @param {bool} autoRespond
    *        if {true} will auto respond on errors with the {res} object.
    * @param {hash} allParams
    *        if you want to limit the parameters .validateParameters()
    *        evaluates, then pass in the values as a { "param" : {value} }
    *        hash.
    *        if not provided, then we use the req.allParams() to retrieve
    *        the parameters to evaluate.
    * @return {bool}
    *
    */
   validate(description = {}, allParams) {
      /*
       * description = {
       *   "field" : { type: "type", required: [true|false] }
       * }
       */
      if (Joi) {
         var key = JSON.stringify(description);
         if (!validators[key]) {
            // parse the description to create a Joi.object() validator:

            var inputs = {};
            // {hash} inputs
            // final { "field": Joi.rules() } object:
            // this will become the final validators[key] entry that
            // processes our rules.

            var setConstraints = [];
            // some rules are applied to the final Joi.object()

            var parseRules = (test, dKey, input, level = 1) => {
               // Recursive fn() to parse the validation description.
               // @test:  {Joi}  test runner
               // @dKey:  {string} the current parameter name
               // @input: {hash} the definition hash we are processing
               // @level: {int}  tracks the depth of the definition hash

               Object.keys(input).forEach((iKey) => {
                  if (!iKey) return;

                  var iVal = input[iKey];
                  switch (iKey) {
                     case "allow":
                        // .allow: ['', null, ...]
                        if (_.isArray(iVal)) {
                           test = test.allow(...iVal);
                        } else {
                           test = test.allow(iVal);
                        }
                        break;

                     //
                     // Constraint Fields:
                     //
                     // These specify specific constraints on the overall
                     // object, but in shorthand we allow it to be coded
                     // into the field definition.
                     // for Example:
                     // {
                     //    "password" : {
                     //       "string":true,
                     //       "with": "confirmPassword"     // <-- constraint
                     //    },
                     //    "confirmPassword" : {
                     //       "string":true
                     //    }
                     // }

                     case "with":
                     // .with : "other_field"
                     // eslint-disable-next-line no-fallthrough -- intentional
                     case "xor":
                        // .xor: "other_field"
                        setConstraints.push({
                           op: iKey,
                           params: [dKey, iVal],
                           // paramA: dKey,
                           // paramB: iVal,
                        });
                        break;

                     case "pattern":
                        // handler RegEx patterns:
                        // .pattern: '^[a-zA-Z0-9]{3,30}$'
                        test = test.pattern(new RegExp(iVal));
                        break;

                     case "min":
                     case "max":
                        // convert param to integer:
                        var param = parseInt(iVal);
                        test = test[iKey](param);
                        break;

                     case "type":
                        console.error(
                           "reqAB.validateParameters(): .type param is depreciated.",
                        );

                        // include "string" in email types:
                        if (input[key] == "email") {
                           test = test.string();
                        }
                        test = test[iVal]();
                        break;

                     case "validate":
                        // this is a custom validator that we should ignore.
                        break;

                     default:
                        // assume the key corresponds to a direct Joi.iKey()
                        // Example value:
                        // "email" : {
                        //    required: true,               // Case 1
                        //    string: {                     // Case 3
                        //       min: 5,                    // Case 2
                        //       email: {                   // Case 4
                        //          allowUnicode: true,
                        //          multiple: true
                        //       }
                        //    }
                        // }

                        // Sanity Check:
                        // if (typeof test[iKey] != "function") {
                        //    var error = new Error(
                        //       "reqAB.validateParemeters(): unknown iJoi param: " +
                        //          iKey
                        //    );
                        //    console.error(error);
                        //    console.error(test);
                        //    return;
                        // }

                        // Case 1: this is a simple:
                        //    .iKey: true  ==>  Joi.iKey()  call:
                        // for example:
                        //    .required: true
                        if (typeof iVal == "boolean" && iVal) {
                           try {
                              test = test[iKey]();
                           } catch (e) {
                              console.error(e);
                              console.error(`iKey : ${iKey}`);
                              console.error(`iVal : ${iVal}`);
                           }

                           return;
                        }

                        // Case 2: this is a simple
                        // .iKey : value  ==> Joi.iKey( value )  call:
                        // for example:
                        //    .min: "5"
                        //
                        if (typeof iVal != "object") {
                           test = test[iKey](iVal);
                           return;
                        }

                        // Case 3: this is our first level description
                        // with a sub level of following modifiers:
                        //    .iKey : {                  // Level 1
                        //       .param1: true,          // Level 2
                        //       .param2: value
                        //       .param3: { options }
                        //    }
                        // for example:
                        //    .string: {                 // <-- iKey
                        //       min: 1,
                        //       max: 50,
                        //       email: { options }
                        //    }

                        if (level == 1) {
                           try {
                              test = test[iKey]();
                              test = parseRules(test, dKey, iVal, level + 1);
                           } catch (e) {
                              console.error(e);
                              let iValText = iVal;
                              try {
                                 iValText = JSON.stringify(iVal);
                                 // eslint-disable-next-line no-unused-vars
                              } catch (eJson) {
                                 /* just ignore */
                              }

                              console.error(`iKey : ${iKey}`);
                              console.error(`iVal : ${iValText}`);
                           }

                           return;
                        }

                        // Case 4: this is our 2nd level description where
                        // we can pass in parameters to a Joi fn():
                        //    .param : {                 // Level 1
                        //       .param1: true,          // Level 2
                        //       .param2: value
                        //       .iKey: { options }
                        //    }
                        // for example:
                        //    .string: {
                        //       min: 1,
                        //       max: 50,
                        //       email: { options }      // <-- iKey
                        //    }
                        test = test[iKey](iVal);
                        break;
                  }
               });
               return test;
            };

            // for each variable defined in the description:
            Object.keys(description).forEach((dKey) => {
               var input = description[dKey];
               // all the rules for the current field (dKey)

               inputs[dKey] = parseRules(Joi, dKey, input);
               // parse the validation rules
            });

            // create our validator object
            var jObj = Joi.object(inputs);

            // add in any top level constraints:
            setConstraints.forEach((con) => {
               jObj[con.op](...con.params);
            });

            // store our new validator:
            validators[key] = jObj;
         }

         var validator = validators[key];
         var results = null;
         results = validator.validate(allParams);

         // if there are errors due to joi rules:
         this.__validationErrors = this.__validationErrors || [];
         this.__validationParamsNormalized =
            this.__validationParamsNormalized || {};
         if (results.error) {
            this.__validationErrors.push(results.error);
         } else {
            // now check any provided .validate() functions in the description
            Object.keys(results.value || {}).forEach((p) => {
               if (description[p] && description[p].validate) {
                  if (typeof description[p].validate != "function") {
                     var err = new Error(
                        `req.ab.validateParameters(): ${p}.validate() is not a function.  Not sure what your attempting here.`,
                     );
                     console.error(err);
                     return;
                  }

                  // Run the provided .validation()
                  var r = description[p].validate(
                     results.value[p],
                     results.value,
                  );

                  // if this resulted in an error, record it
                  if (r.error) {
                     this.__validationErrors.push(r.error);
                  }

                  // update our normalized results with r.value
                  results.value[p] = r.value;
               }
            });
         }
      }

      // record our Normalized Values:
      if (results && results.value) {
         this.__validationParamsNormalized = results.value;
      }

      return this.__validationErrors.length == 0;
   }
}

module.exports = function (...params) {
   return new ABRequestValidation(...params);
};
