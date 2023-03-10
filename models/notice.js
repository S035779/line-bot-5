const fs = require("fs");
const mongoose = require("mongoose");
const log = require("log4js").getLogger("notice");

const options = {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  user: process.env.MDB_USER,
  pass: process.env.MDB_PASS, 
  dbName: "feed",
  sslValidate: false,
  sslCA: fs.readFileSync(process.env.MDB_CA),
  sslKey: fs.readFileSync(process.env.MDB_KEY),
  sslCert: fs.readFileSync(process.env.MDB_CERT),
};

mongoose.connect(process.env.MDB_NAME, options)
  .then(() => log.info("db initialize is successfully."))
  .catch(err => log.error("db initialize error: ", err));

mongoose.connection
  .on("connecting", () => log.info("db connecting..."))
  .on("connected", () => log.info("db connected."))
  .on("open", () => log.info("db opened."))
  .on("disconnecting", () => log.info("db disconnecting..."))
  .on("disconnected", () => log.info("db disconnected."))
  .on("close", () => log.info("db closed"))
  .on("reconnected", () => log.info("db reconnected."))
  .on("error", err => log.error("db connection error: ", err))
  .on("fullsetup", () => log.info("db fullsetup."))
  .on("all", () => log.info("all db connected."));

const noticeSchema = new mongoose.Schema({
  user: { type: String, required: true },
  noticeId: { type: Number, required: true },
  account: { type: String, required: true },
  category: { type: String, required: true },
  consumerKey: String,
  consumerSecret: String,
  accessTokenKey: String,
  accessTokenSecret: String,
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: 0 },
}, { collection: "notices" });

noticeSchema.index({ user: 1, category: 1, noticeId: 1 });

module.exports = mongoose.model("Notice", noticeSchema);
