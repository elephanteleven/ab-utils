/**
 * utility functions to help with our initial config values:
 * @module defaults
 * @ignore
 */

/**
 * @param {string} envKey
 *                 the specific process.env[key] value we are requesting
 * @param {multi} defaultValue [optional]
 *                the value to return if the envKey is not provided.
 * @returns {multi}
 */
function env(envKey, defaultValue) {
   if (typeof process.env[envKey] == "undefined" || process.env[envKey] == "") {
      return defaultValue;
   }
   try {
      return JSON.parse(process.env[envKey]);
   } catch (e) {
      // NOT all of our env variables can be JSON.parsed()
      // we expect some of these values to error out
      // no need to report them:
      let expectedValues = ["http"];
      let isExpected = false;
      expectedValues.forEach((/*v*/) => {
         if (process.env[envKey].indexOf("http") != -1) {
            isExpected = true;
         }
      });
      if (!isExpected) {
         // let's report this just in case:
         console.log(e);
         console.log(`process.env[${envKey}]=[${process.env[envKey]}]`);
      }

      return process.env[envKey];
   }
}

module.exports = {
   env,
   datastores: () => {
      return {
         appbuilder: {
            adapter: "sails-mysql",
            host: env("MYSQL_HOST", "db"),
            port: env("MYSQL_PORT", 3306),
            user: env("MYSQL_USER", "root"),
            password: process.env.MYSQL_PASSWORD,
            database: env("MYSQL_DBPREFIX", "appbuilder"),
         },
         site: {
            adapter: "sails-mysql",
            host: env("MYSQL_HOST", "db"),
            port: env("MYSQL_PORT", 3306),
            user: env("MYSQL_USER", "root"),
            password: process.env.MYSQL_PASSWORD,
            database: env("MYSQL_DBADMIN", "appbuilder-admin"),
         },
      };
   },
};
