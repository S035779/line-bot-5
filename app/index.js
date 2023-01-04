const log4js = require("log4js");
const indexRouter = require("../routes");
const botRouter = require("../routes/bot");
const apiRouter = require("../routes/api");

const log = log4js.getLogger("app");
const app = require("express")();

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto" }));

app.use("/", indexRouter);
app.use("/bot", botRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(_res, _req, next) {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
app.set("env", process.env.NODE_ENV || "development");
if (app.get("env") === "development") {
  app.use(function(err, _req, res) {
    log.error("Something went wrong:", err);
    res.status(err.status || 500).end();
  });
}

// production error handler
// no stacktrace leaked to user
app.use(function(err, _req, res) {
  log.error("Something went wrong:", err);
  res.status(err.status || 500).end();
});

module.exports = app;
