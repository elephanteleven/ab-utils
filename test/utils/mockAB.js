var path = require("path");
var Model = require(path.join(__dirname, "..", "..", "utils", "model.js"));

module.exports = {
   configDB: function () {
      return this._dbConfig;
   },
   tenantID: function () {
      return this._tenantID;
   },
   log: function () {},
   model: function (key) {
      this._configs = this._configs || {};
      if (this._configs[key]) {
         var newModel = new Model(this._configs[key], this._DBConn, this);
         newModel._key = key;
         return newModel;
      } else {
         return null;
      }
   },
};
