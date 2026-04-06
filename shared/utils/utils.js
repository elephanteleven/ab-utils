/**
 * Tenant.js
 * define our DB operations.
 */
const crypto = require("crypto");

module.exports = {
   /**
    * Returns a hex string of 32 random bytes for use as the user's password
    * salt.
    *
    * @return string
    */
   generateSalt: function () {
      return crypto.randomBytes(32).toString("hex");
   },

   /**
    * Generate a password hash from its plaintext value and salt.
    * The hash algorithm is intentionally slow in order to thwart brute force
    * password cracking.
    *
    * @param string password
    * @param string salt
    * @return {Promise}
    *      Resolves with the hashed password string, 1024 characters in length
    */
   hash: function (password, salt) {
      return new Promise((resolve, reject) => {
         if (salt == null) {
            var err = new Error(
               "user can not have a null salt. Perhaps this is an old account needing updating?",
            );
            reject(err);
         } else {
            crypto.pbkdf2(
               password,
               salt,
               100000,
               512,
               "sha1",
               function (err, key) {
                  if (err) {
                     reject(err);
                  } else {
                     resolve(key.toString("hex"));
                  }
               },
            );
         }
      });
   },

   safeUser: function (user) {
      var safeUser = {};
      var ignoreFields = ["password", "salt"];
      for (var prop in user) {
         // if we send back a Class Instance then:
         // if (user.hasOwnProperty(prop)) {
         if (user[prop]) {
            if (ignoreFields.indexOf(prop) == -1) {
               safeUser[prop] = user[prop];
            }
         }
      }
      return safeUser;
   },
};
