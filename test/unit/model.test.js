/**
 * Model
 * test the interface for model.
 */
var path = require("path");
var _ = require("lodash");
var expect = require("chai").expect;

// Base config value.
var defaultConfig = require(path.join(__dirname, "..", "utils", "config.js"));

// Our service handler:
var Model = require(path.join(__dirname, "..", "..", "utils", "model.js"));
var DBConn = require(path.join("..", "utils", "mockDBConn.js"));
var AB = require(path.join("..", "utils", "mockAB.js"));

describe("Model", () => {
   describe("attributes", function () {
      // Check for proper initialization

      /*
       * Model configurations that don't expressly prohibit createdAt & updatedAt
       * will add them to the attributes.
       */
      it("should add on createdAt & updatedAt fields", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var allConfigAttributes = Object.keys(config.attributes);
         var AllAttributes = Test.attributes();
         expect(Test).to.exist;
         expect(AllAttributes).to.have.lengthOf(allConfigAttributes.length + 2);
      });

      /*
       * Model configurations that set createdAt & updatedAt to false leave them
       * off.
       */
      it("should ignore createdAt & updatedAt fields when false", function () {
         var config = defaultConfig.baseNoAdds;
         var Test = new Model(config, DBConn, AB);
         var allConfigAttributes = Object.keys(config.attributes);
         var AllAttributes = Test.attributes();
         expect(AllAttributes).to.have.lengthOf(allConfigAttributes.length - 2);
      });

      /*
       * Model convert the simple attributes into complete object definitions.
       */
      it("should ensure all fields have default values", function () {
         var Test = new Model(defaultConfig.base, DBConn, AB);
         var defaultValues = ["type", "column_name", "attr_name"];
         var AllAttributes = Test.attributes();
         var allThere = true;
         AllAttributes.forEach((attr) => {
            defaultValues.forEach((v) => {
               if (typeof attr[v] == "undefined") {
                  allThere = false;
               }
            });
         });
         expect(allThere).to.be.true;
      });

      /*
       * Model.attributes should filter the given attrs by the passed in fn.
       */
      it("filter attributes", function () {
         var Test = new Model(defaultConfig.base, DBConn, AB);
         var jsonAttributes = Test.attributes((a) => {
            return a.type == "json";
         });
         expect(jsonAttributes).to.be.an.instanceof(Array);
         expect(jsonAttributes).to.have.lengthOf(1);
      });
   });

   describe(".tableName()", function () {
      /*
       * Model.tableName should return values properly quoted
       */
      it("properly quoted", function () {
         var config = defaultConfig.base;
         AB._dbConfig = { database: "testDB" };
         AB._tenantID = null;
         var Test = new Model(config, DBConn, AB);
         var name = Test.tableName();
         expect(name).to.exist;
         expect(typeof name).to.equal("string");
         expect(name).to.have.lengthOf(config.table_name.length + 2);
         expect(name).to.contain("`");
      });

      /*
       * Model.tableName should return values properly quoted
       */
      it("with added tenant info", function () {
         var config = defaultConfig.base;
         AB._dbConfig = { database: "testDB" };
         AB._tenantID = "tenant";
         var Test = new Model(config, DBConn, AB);
         var name = Test.tableName();
         expect(name).to.exist;
         expect(typeof name).to.equal("string");
         expect(name).to.have.string(config.table_name);
         expect(name).to.have.string(AB._dbConfig.database);
         expect(name).to.have.string(AB._tenantID);
         expect(name).to.contain("`");
      });

      /*
       * Model.tableName not return db-tenant format if site_only
       * attribute set:
       */
      it("prevent db-tenant if site_only flag set", function () {
         var config = _.cloneDeep(defaultConfig.base);
         config.site_only = true;
         AB._dbConfig = { database: "testDB" };
         AB._tenantID = "tenant";
         var Test = new Model(config, DBConn, AB);
         var name = Test.tableName();
         expect(name).to.exist;
         expect(typeof name).to.equal("string");
         expect(name).to.have.string(config.table_name);
         expect(name).to.not.have.string(AB._dbConfig.database);
         expect(name).to.not.have.string(AB._tenantID);
         expect(name).to.contain("`");
      });

      /*
       * Model.tableName should return null if missing database
       * data
       */
      it("with added tenant info", function () {
         var config = _.cloneDeep(defaultConfig.base);
         AB._dbConfig = {};
         AB._tenantID = "tenant";
         var Test = new Model(config, DBConn, AB);
         var name = Test.tableName((err) => {
            expect(err).to.exist;
            expect(err.code).to.equal("E_CONFIG_ERROR");
         });
         expect(name).to.equal(null);
      });
   });

   describe("._usefulValues()", function () {
      /*
       * Model.usefulValues should return only values that exist
       * in attributes definition:
       */
      it("only listed values", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var values = Test._usefulValues({
            string: "keep",
            striiing: "dontkeep",
         });
         expect(values).to.exist;
         expect(values).to.be.an("object");
         expect(values).to.have.all.keys("string");
         expect(values).to.not.have.all.keys("striiing");
      });

      /*
       * Model.usefulValues include createdAt or updatedAt when specified:
       */
      it("include createdAt or updatedAt when specified", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var values = Test._usefulValues(
            { string: "keep", striiing: "dontkeep" },
            true,
            false,
         );
         expect(values).to.exist;
         expect(values).to.be.an("object");
         expect(values).to.have.all.keys("string", "created_at");
         expect(values).to.not.have.all.keys("striiing", "updated_at");

         var values2 = Test._usefulValues(
            { string: "keep", striiing: "dontkeep" },
            false,
            true,
         );
         expect(values2).to.exist;
         expect(values2).to.be.an("object");
         expect(values2).to.have.all.keys("string", "updated_at");
         expect(values2).to.not.have.all.keys("striiing", "created_at");
      });

      /*
       * Model.usefulCreateValues include createdAt && updatedAt :
       */
      it(".usefulCreateValues() include createdAt && updatedAt when specified :", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var values = Test.usefulCreateValues({
            string: "keep",
            striiing: "dontkeep",
         });
         expect(values).to.exist;
         expect(values).to.be.an("object");
         expect(values).to.have.all.keys("string", "created_at", "updated_at");
         expect(values).to.not.have.all.keys("striiing");
      });

      /*
       * Model.usefulUpdateValues include only updatedAt :
       */
      it(".usefulUpdateValues() include only updatedAt :", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var values = Test.usefulUpdateValues({
            string: "keep",
            striiing: "dontkeep",
         });
         expect(values).to.exist;
         expect(values).to.be.an("object");
         expect(values).to.have.all.keys("string", "updated_at");
         expect(values).to.not.have.all.keys("striiing", "created_at");
      });
   });

   describe(".normalizeResonse() ", function () {
      /*
       * Model.normalizeResonse return an array if passed an array
       */
      it("return an array if passed an array", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var values = Test._normalizeResponse([
            { string: "keep", json: `{ "converted":true }` },
         ]);
         expect(values).to.exist;
         expect(values).to.be.an.instanceof(Array);
         expect(values).to.have.lengthOf(1);
      });

      /*
       * Model.normalizeResonse return an object if passed an object
       */
      it("return an array if passed an array", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var values = Test._normalizeResponse({
            string: "keep",
            json: `{ "converted":true }`,
         });
         expect(values).to.exist;
         expect(values).to.be.an("object");
      });

      /*
       * Model.normalizeResonse convert json string -> data
       */
      it("convert json string -> data", function () {
         var config = defaultConfig.base;
         var Test = new Model(config, DBConn, AB);
         var values = Test._normalizeResponse({
            string: "keep",
            json: `{ "converted":true }`,
         });
         expect(values).to.exist;
         expect(values).to.have.all.keys("string", "json");
         expect(typeof values.json).to.not.equal("string");
         expect(values.json).to.have.all.keys("converted");

         values = Test._normalizeResponse({
            string: "keep",
            json: { converted: true },
         });
         expect(values).to.exist;
         expect(values).to.have.all.keys("string", "json");
         expect(typeof values.json).to.not.equal("string");
         expect(values.json).to.have.all.keys("converted");
      });
   });

   describe(".create()", function () {
      /*
       * Model.create() provide tenanted db table
       */
      it("provide tenanted db table", function (done) {
         ProvidedTenantedDBTable(
            "create",
            {
               uuid: "abc",
               string: "string",
               striiing: "doneKeep",
               json: "{converted:true}",
            },
            [],
            done,
         );
      });

      /*
       * Model.create() site only table
       */
      it("provide site only table", function (done) {
         ProvidedSiteOnlyTable(
            "create",
            {
               uuid: "abc",
               string: "string",
               striiing: "doneKeep",
               json: "{converted:true}",
            },
            [],
            done,
         );
      });

      /*
       * Model.create() returns error
       */
      it("returns error", function (done) {
         ReturnsError(
            "create",
            {
               string: "string",
               striiing: "doneKeep",
               json: "{converted:true}",
            },
            done,
         );
      });

      /*
       * Model.create() prevent unknown attributes in values
       */
      it("prevent unknown attributes in values", function (done) {
         var config = _.cloneDeep(defaultConfig.base);
         AB._dbConfig = { database: "testDB" };
         AB._tenantID = "tenant";

         DBConn.query = (sql, values, cb) => {
            expect(values).to.have.keys(
               "uuid",
               "string",
               "json",
               "created_at",
               "updated_at",
            );
            expect(values).to.not.have.all.keys("striiing");
            cb(null, { insertId: 1 });
         };

         var Test = new Model(config, DBConn, AB);
         var createValues = {
            uuid: "abc",
            string: "string",
            striiing: "doneKeep",
            json: "{converted:true}",
         };

         // NOTE: .create() now does an additional .find() to return a full entry
         // as it's result.  Here we mock .find() to return expected values:
         Test.find = () => {
            return Promise.resolve(createValues);
         };
         Test.create(createValues).then(done).catch(done);
      });
   });

   describe(".destroy()", function () {
      /*
       * Model.destroy() provide tenanted db table
       */
      it("provide tenanted db table", function (done) {
         ProvidedTenantedDBTable("destroy", { id: 1 }, [], done);
      });

      /*
       * Model.destroy() site only table
       */
      it("provide site only table", function (done) {
         ProvidedSiteOnlyTable("destroy", { id: 1 }, [], done);
      });

      /*
       * Model.destroy() prevent unknown attributes in condition
       */
      //// TODO: prevent unknown attributes in condition ??

      /*
       * Model.destroy() requires a condition
       */
      it("requires a condition.", function (done) {
         ReturnsError("destroy", null, done);
      });

      /*
       * Model.destroy() returns error
       */
      it("returns error", function (done) {
         ReturnsError("destroy", { id: 1 }, done);
      });
   });

   describe(".find()", function () {
      /*
       * Model.find() provide tenanted db table
       */
      it("provide tenanted db table", function (done) {
         ProvidedTenantedDBTable("find", { string: "me" }, [], done);
      });

      /*
       * Model.find() site only table
       */
      it("provide site only table", function (done) {
         ProvidedSiteOnlyTable("find", { string: "me" }, [], done);
      });

      /*
       * Model.find() returns error
       */
      it("returns error", function (done) {
         ReturnsError("find", { string: "me" }, done);
      });

      /*
       * Model.find() requires a condition
       */
      it("requires a condition.", function (done) {
         ReturnsError("find", null, done);
      });

      /*
       * Model.find() with an empty condition obj finds all
       */
      it("with an empty condition obj finds all", function (done) {
         ReturnAllIfEmptyCond("find", {}, done);
      });
   });

   describe(".update()", function () {
      /*
       * Model.update() provide tenanted db table
       */
      it("provide tenanted db table", function (done) {
         ProvidedTenantedDBTable(
            "update",
            [
               {
                  string: "string",
                  striiing: "doneKeep",
                  json: "{converted:true}",
               },
               {},
            ],
            [],
            done,
         );
      });

      /*
       * Model.create() site only table
       */
      it("provide site only table", function (done) {
         ProvidedSiteOnlyTable(
            "update",
            [
               {
                  string: "string",
                  striiing: "doneKeep",
                  json: "{converted:true}",
               },
               {},
            ],
            [],
            done,
         );
      });

      /*
       * Model.create() returns error
       */
      it("returns error", function (done) {
         ReturnsError(
            "update",
            [
               {
                  string: "string",
                  striiing: "doneKeep",
                  json: "{converted:true}",
               },
               {},
            ],
            done,
         );
      });

      /*
       * Model.update() requires a condition
       */
      it("requires a condition.", function (done) {
         ReturnsError("update", null, done);
      });

      /*
       * Model.update() prevent unknown attributes in values
       */
      it.skip("prevent unknown attributes in values", function (done) {
         var config = _.cloneDeep(defaultConfig.base);
         AB._dbConfig = { database: "testDB" };
         AB._tenantID = "tenant";

         DBConn.query = (sql, params, cb) => {
            var values;
            if (Array.isArray(params)) {
               values = params[0];
            } else {
               values = params;
            }
            expect(values).to.have.all.keys("string", "json", "updated_at");
            expect(values).to.not.have.all.keys("striiing");
            cb();
         };

         var Test = new Model(config, DBConn, AB);
         Test.update(
            { string: "me" },
            {
               string: "string",
               striiing: "doneKeep",
               json: "{converted:true}",
            },
         )
            .then(done)
            .catch(done);
      });
   });

   //
   // Reused Tests
   //
   function ProvidedTenantedDBTable(command, params, response, done) {
      params = Array.isArray(params) ? params : [params];
      var config = _.cloneDeep(defaultConfig.base);
      AB._dbConfig = { database: "testDB" };
      AB._tenantID = "tenant";

      DBConn.query = (sql, values, cb) => {
         expect(sql).to.exist;
         // expect(values).to.exist;
         expect(cb).to.exist;

         expect(sql).to.contain("testDB-tenant");
         expect(sql).to.contain(config.table_name);
         expect(sql).to.contain(sqlTableName);
         cb(null, response);
      };

      var Test = new Model(config, DBConn, AB);
      var sqlTableName = Test.tableName();
      Test[command](...params)
         .then(() => {
            done();
         })
         .catch(done);
   }

   function ProvidedSiteOnlyTable(command, params, response, done) {
      params = Array.isArray(params) ? params : [params];
      var config = _.cloneDeep(defaultConfig.base);
      config.site_only = true;
      AB._dbConfig = { database: "testDB" };
      AB._tenantID = "tenant";

      DBConn.query = (sql, values, cb) => {
         expect(sql).to.exist;
         // expect(values).to.exist;
         expect(cb).to.exist;

         expect(sql).to.not.contain("testDB-tenant");
         expect(sql).to.contain(config.table_name);
         expect(sql).to.contain(sqlTableName);
         cb(null, response);
      };

      var Test = new Model(config, DBConn, AB);
      var sqlTableName = Test.tableName();
      Test[command](...params)
         .then(() => {
            done();
         })
         .catch((err) => {
            console.log(err);
            done();
         });
   }

   function ReturnsError(command, params, done) {
      var config = _.cloneDeep(defaultConfig.base);
      AB._dbConfig = { database: "testDB" };
      AB._tenantID = "tenant";

      DBConn.query = (sql, values, cb) => {
         cb(new Error("test"));
      };

      var Test = new Model(config, DBConn, AB);
      Test[command](params)
         .then(() => {
            // shouldn't have gotten here:
            expect(true).to.be.false;
            done();
         })
         .catch((error) => {
            expect(error).to.exist;
            done();
         });
   }

   function ReturnAllIfEmptyCond(command, params, done) {
      var config = _.cloneDeep(defaultConfig.base);
      AB._dbConfig = { database: "testDB" };
      AB._tenantID = "tenant";

      DBConn.query = (sql, values, cb) => {
         expect(sql).to.not.include("WHERE");
         expect(values).to.equal(null);
         cb();
      };

      var Test = new Model(config, DBConn, AB);
      Test[command](params)
         .then(() => {
            done();
         })
         .catch(() => {
            // shouldn't have gotten here:
            expect(true).to.be.false;
            done();
         });
   }
});
