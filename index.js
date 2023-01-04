"use strict";

const cluster = require("express-cluster");

try {
  require("fs").mkdirSync("./logs");
} catch (err) {
  if (err.code !== "EEXIST") {
    console.error("Could not set up log directory, error was: ", err);
    process.exit(1);
  }
}

const log4js = require("log4js");
log4js.configure("./config/log4js.json");
const log = log4js.getLogger("startup");

cluster(function() {
  const app = require("./app");

  app.set("port", process.env.PORT || 3000);

  const server = app.listen(app.get("port"), function() {
    log.info(`Express server listening on port ${server.address().port} with pid ${process.pid}.`);
  });
});
