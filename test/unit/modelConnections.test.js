/**
 * Model
 * test the interface for model.
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

describe("model: connections", () => {
   describe("attributes", function () {
      /*
       * Models with connection attributes, are properly initialize
       */
      it("are properly initialize", function () {
         var config = defaultConfig.connectionA;
         var Test = new Model(config, DBConn, AB);
         var allConfigAttributes = Object.keys(config.attributes);
         var AllAttributes = Test.attributes();
         expect(Test).to.exist;
         expect(AllAttributes).to.have.lengthOf(allConfigAttributes.length + 2);
         allConfigAttributes.forEach((attr) => {
            expect(
               AllAttributes.find((a) => {
                  return a.attr_name == attr;
               }),
            ).to.exist;
         });
      });

      it("are properly initialize", function () {
         var config = defaultConfig.connectionB;
         var Test = new Model(config, DBConn, AB);
         var allConfigAttributes = Object.keys(config.attributes);
         var AllAttributes = Test.attributes();
         expect(Test).to.exist;
         expect(AllAttributes).to.have.lengthOf(allConfigAttributes.length + 2);
         allConfigAttributes.forEach((attr) => {
            expect(
               AllAttributes.find((a) => {
                  return a.attr_name == attr;
               }),
            ).to.exist;
         });
      });

      /*
       * ._connectionInfo()
       * should properly define the relevant connection info:
       */
      it("define proper _connectionInfo() ", function () {
         var config = defaultConfig.connectionA;
         var Test = new Model(config, DBConn, AB);
         Test._key = "connectionA";
         var info = Test._connectionInfo("one_one");
         expect(info).to.have.all.keys(
            "type",
            "dominant",
            "attribute",
            "otherModel",
            "otherAttribute",
         );
         expect(info.type).to.be.a("string");
         expect(info.dominant).to.be.a("boolean");
         expect(info.attribute).to.be.an("object");
         expect(info.otherModel).to.be.an("object");
         expect(info.otherAttribute).to.be.an("object");
      });

      /*
       * 1:1 relationship
       */
      it("detect 1:1 relationships ", function () {
         var config = defaultConfig.connectionA;
         var Test = new Model(config, DBConn, AB);
         Test._key = "connectionA";
         var info = Test._connectionInfo("one_one");
         expect(info.type).to.equal("1:1");
      });

      /*
       * 1:many relationship
       */
      it("detect 1:many relationships ", function () {
         var config = defaultConfig.connectionA;
         var Test = new Model(config, DBConn, AB);
         Test._key = "connectionA";
         var info = Test._connectionInfo("one_many");
         expect(info.type).to.equal("1:many");
      });

      /*
       * many:1 relationship
       */
      it("detect many:1 relationships ", function () {
         var config = defaultConfig.connectionB;
         var Test = new Model(config, DBConn, AB);
         Test._key = "connectionB";
         var info = Test._connectionInfo("many_one");
         expect(info.type).to.equal("many:1");
      });

      /*
       * many:many relationship
       */
      it("detect many:many relationships ", function () {
         var config = defaultConfig.connectionB;
         var Test = new Model(config, DBConn, AB);
         Test._key = "connectionB";
         var info = Test._connectionInfo("many_manyb");
         expect(info.type).to.equal("many:many");
      });

      /*
       * throws errors when models improperly configured
       * can't find field
       * attribute isn't a connection
       * can't find other model
       * can't find matching Attribute for model
       *
       */
      it("throws errors when models improperly configured", function () {
         var Test = getConnection("connectionA");
         expect(() => {
            Test._connectionInfo("noField");
         }).to.throw();
         expect(Test._connectionInfo("createdAt")).to.equal(null);
         expect(() => {
            Test._connectionInfo("noModel");
         }).to.throw();
         expect(() => {
            Test._connectionInfo("noOtherAttribute");
         }).to.throw();
      });
   });

   describe("resolving conditions", function () {
      it("resolves Many:1 conditions ", function (done) {
         var Test = getConnection("connectionB");
         var conInfo = Test._connectionInfo("many_one");
         var cond = {
            uuid: [1],
            many_one: [5],
         };
         // mock the otherModel to return data we are expecting
         conInfo.otherModel = {
            find: () => {
               return Promise.resolve().then(() => {
                  return [{ one_many: 5 }];
               });
            },
         };
         Test.resolveManyOne(cond, "many_one", conInfo).then(() => {
            expect(cond).to.have.keys("uuid");
            expect(cond).to.not.have.keys("many_one");
            expect(cond.uuid).to.be.an("array").that.includes(1);
            expect(cond.uuid).to.be.an("array").that.includes(5);
            done();
         });
      });
      it("Test get-join model", function (done) {
         var Test = getConnection("connectionB");
         var conInfo = Test._connectionInfo("many_manyb");
         var model = Test._getJoinModel(conInfo);
         expect(model.tableName()).to.include("connectionB_connectionA");
         done();
      });
      it("resolves Many:Many conditions ", function (done) {
         var Test = getConnection("connectionB");
         var conInfo = Test._connectionInfo("many_manyb");
         var cond = {
            uuid: [1],
            many_manyb: [2],
         };
         // mock the otherModel to return data we are expecting
         Test._getJoinModel = () => {
            return {
               find: () => {
                  return Promise.resolve().then(() => {
                     return [{ connectionA: 2, connectionB: 5 }];
                  });
               },
            };
         };
         Test.resolveManyMany(cond, "many_manyb", conInfo).then(() => {
            expect(cond).to.have.keys("uuid");
            expect(cond).to.not.have.keys("many_manyb");
            expect(cond.uuid).to.be.an("array").that.includes(1);
            expect(cond.uuid).to.be.an("array").that.includes(5);
            done();
         });
      });

      it("resolves 1:1 conditions ", function (done) {
         var Test = getConnection("connectionB");
         var cond = {
            uuid: [1],
            one_one: 2,
         };
         Test._resolveConnectedConditions(cond).then((newCond) => {
            expect(newCond).to.have.keys("uuid", "one_one");
            expect(newCond.uuid).to.be.an("array").that.includes(1);
            expect(newCond.one_one).to.equal(2);
            done();
         });
      });

      it("resolves 1:many conditions ", function (done) {
         var Test = getConnection("connectionA");
         var cond = {
            uuid: [1],
            one_many: 2,
         };
         Test._resolveConnectedConditions(cond).then((newCond) => {
            expect(newCond).to.have.keys("uuid", "one_many");
            expect(newCond.uuid).to.be.an("array").that.includes(1);
            expect(newCond.one_many).to.equal(2);
            done();
         });
      });

      it("resolves many:1 conditions ", function (done) {
         var Test = getConnection("connectionB");
         var cond = {
            uuid: [1],
            many_one: 2,
         };

         var connInfo = Test._connectionInfo("many_one");
         connInfo.otherModel = {
            find: () => {
               return Promise.resolve().then(() => {
                  return [{ one_many: 5 }];
               });
            },
         };
         Test._connectionInfo = () => {
            return connInfo;
         };

         Test._resolveConnectedConditions(cond).then((newCond) => {
            expect(newCond).to.have.keys("uuid");
            expect(newCond.uuid).to.be.an("array").that.includes(1);
            expect(newCond.uuid).to.be.an("array").that.includes(5);
            done();
         });
      });

      it("resolves Many:Many conditions ", function (done) {
         var Test = getConnection("connectionB");
         // var conInfo = Test._connectionInfo("many_manyb");
         var orgCond = {
            uuid: [1],
            many_manyb: [2],
         };
         // mock the otherModel to return data we are expecting
         Test._getJoinModel = () => {
            return {
               find: () => {
                  return Promise.resolve().then(() => {
                     return [{ connectionA: 2, connectionB: 5 }];
                  });
               },
            };
         };
         Test._resolveConnectedConditions(orgCond).then((cond) => {
            expect(cond).to.have.keys("uuid");
            expect(cond).to.not.have.keys("many_manyb");
            expect(cond.uuid).to.be.an("array").that.includes(1);
            expect(cond.uuid).to.be.an("array").that.includes(5);
            done();
         });
      });
   });

   function getConnection(key) {
      var config = defaultConfig[key];
      var Test = new Model(config, DBConn, AB);
      Test._key = key;
      return Test;
   }
});
