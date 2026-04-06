/**
 * Define a common AppBuilder Service class for use in our micro services.
 * @module service
 * @class ABService
 * @extends EventEmitter
 * @param {obj} options
 * @param {string} [options.name=ABService]
 */
// var path = require("path");
// var _ = require("lodash");
var EventEmitter = require("events").EventEmitter;

class ABService extends EventEmitter {
   constructor(options) {
      super();

      options = options || {};

      this.name = options.name || "ABService";

      this.on("ready", () => {
         this.run();
      });

      // setup our process listeners:
      process.on("SIGINT", () => {
         console.info("SIGINT signal received.");
         this.shutdown();
      });

      process.on("SIGTERM", () => {
         console.info("SIGTERM signal received.");
         this.shutdown();
      });

      //  perform my startup actions.
      this.startup();
   }

   /**
    * ready
    * Send a 'ready' signal on this process. Useful for service managers
    * (like pm2) to know the process is ready.
    */
   ready() {
      if (process.send) {
         process.send("ready");
      }
   }

   /**
    * run
    * the operation of the Service.  It will be run after the .startup()
    * routine is completed.
    */
   run() {
      // a sub class should put all it's operational code here.
      this.ready();
   }

   /**
    * shutdown
    * the process a service should perform to gracefully shutdown.
    */
   shutdown() {
      console.info(
         `service ${this.name} has not defined a shutdown() routine.`,
      );
      process.exit(0);
   }

   /**
    * startup
    * the process a service should perform to startup.
    */
   startup() {
      console.info(`service ${this.name} has not defined a startup() routine.`);
      this.emit("ready");
   }
}

module.exports = ABService;
