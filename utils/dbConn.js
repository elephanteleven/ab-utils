/**
 * manage and return a connection to our DB.
 * We will currently create a single Mysql Connection Pool and share that among
 * all our running operations.
 * @module dbConn
 */
const Mysql = require("mysql"); // our  {DB Connection}
var DB = null;
// {Mysql}
// DB is a {Mysql} library connection to the Mysql DB that houses our Tenant(s)
// data. It is not expected to be a SPECIFIC connection to a Tenant's database
// directly. Instead any SQL run through this is expected to specify the
// Tenant DB in the SQL.  But DB connects to the running {MySQL|Mariadb} server
// that houses the data.

function newConn(req, limit = 10) {
   var config = req.configDB();
   config.connectionLimit = limit;
   var db = Mysql.createPool(config);
   db.on("error", (err) => {
      req.log("DB.on(error):", err);

      // format of err:
      // {
      //   Error: "read ECONNRESET at TCP.onStreamRead (internal/stream_base_commons.js:162:27)",
      //   errno: 'ECONNRESET',
      //   code: 'ECONNRESET',
      //   syscall: 'read',
      //   fatal: true
      // }

      db.end();
   });
   return db;
}
/**
 * @alias module:dbConn
 * @param {reqService} req
 *        the current {reqService} object for this request
 * @param {bool} shouldCreate
 *        should we create a new DB connection if one isn't currently active?
 * @param {bool} isolate
 *        do we create a NEW connection and return that instead?
 * @returns {Pool} from mysql
 */
const dbConn = function (req, shouldCreate = true, isolate = false) {
   if (isolate) {
      return newConn(req, 5);
   }

   if (!DB) {
      if (shouldCreate) {
         DB = newConn(req);
         DB.on("error", () => {
            DB = null;
         });
      }
   }
   return DB;
};
module.exports = dbConn;
