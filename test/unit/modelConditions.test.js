/**
 * Model Conditions
 * test the condition generation for models.
 */
var path = require("path");
// var _ = require("lodash");
var expect = require("chai").expect;

// Base config value.
var defaultConfig = require(path.join(__dirname, "..", "utils", "config.js"));

// Our service handler:
var Model = require(path.join(__dirname, "..", "..", "utils", "model.js"));
var DBConn = require(path.join("..", "utils", "mockDBConn.js"));
var AB = require(path.join("..", "utils", "mockAB.js"));
AB._configs = defaultConfig;
AB._DBConn = DBConn;

describe("model: conditions ", function () {
   /*
    * Condition: discrete values should be generated as key = ?
    */
   it("discrete values should be generated as key = ?", function () {
      var config = defaultConfig.connectionA;
      var Test = new Model(config, DBConn, AB);
      var cond = {
         key: "value",
      };
      var result = Test._queryConditions("", cond);
      expect(result).to.exist;
      expect(result).to.have.all.keys("query", "values");
      expect(result.query).to.include("key = ?");
      expect(result.values).to.include("value");
   });

   /*
    * Condition: array values should generate IN conditions:
    */
   it("array values should generate IN conditions", function () {
      var config = defaultConfig.connectionA;
      var Test = new Model(config, DBConn, AB);
      var cond = {
         key: ["value"],
      };
      var result = Test._queryConditions("", cond);
      expect(result).to.exist;
      expect(result).to.have.all.keys("query", "values");
      expect(result.query).to.include("key IN ( ? )");
      expect(result.values[0]).to.be.an("array");
      expect(result.values[0]).to.include("value");
   });

   /*
    * Condition: empty array values should generate false conditions:
    */
   it("empty array values should generate false conditions", function () {
      var config = defaultConfig.connectionA;
      var Test = new Model(config, DBConn, AB);
      var cond = {
         key: [],
      };
      var result = Test._queryConditions("", cond);
      expect(result).to.exist;
      expect(result).to.have.all.keys("query", "values");
      expect(result.query).to.include("1 = 0");
      expect(result.values).to.have.lengthOf(0);
   });

   /*
    * Condition: multiple single obj conditions should be ANDed together:
    */
   it("multiple single obj conditions should be ANDed together", function () {
      var config = defaultConfig.connectionA;
      var Test = new Model(config, DBConn, AB);
      var cond = {
         key1: "value1",
         key2: ["value2"],
         key3: [],
      };
      var result = Test._queryConditions("", cond);
      expect(result).to.exist;
      expect(result).to.have.all.keys("query", "values");
      expect(result.query).to.include("key1 = ?");
      expect(result.query).to.include("key2 IN ( ? )");
      expect(result.query).to.include("1 = 0");
      expect(result.query).to.include("AND");
      expect(result.query).to.not.include("OR");
      expect(result.values).to.have.lengthOf(2);
      expect(result.values[0]).to.equal("value1");
      expect(result.values[1]).to.be.an("array");
      expect(result.values[1]).to.include("value2");
   });
});
