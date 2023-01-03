const app = require("express")();
const indexRouter = require("../routes");
const botRouter = require("../routes/bot");
const apiRouter = require("../routes/api");

app.use("/", indexRouter);
app.use("/bot", botRouter);
app.use("/api", apiRouter);

module.exports = app;
