const fs = require("fs");
const mongoose = require("mongoose");
const log = require("log4js").getLogger("user");

const options = {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  user: process.env.MDB_USER,
  pass: process.env.MDB_PASS, 
  dbName: "account",
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

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  username: String,
  timestamp: String,
}, { collection: "users" });

userSchema.index({ userId: 1 });

const groupSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  type: { type: String, required: true },
  groupname: String,
  timestamp: String,
  members: [Object],
}, { collection: "groups"})

groupSchema.index({ groupId: 1 });

const User = mongoose.model("User", userSchema);
const Group = mongoose.model("Group", groupSchema);

module.exports = {
  User,
  Group,
};
