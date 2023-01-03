const fs = require("fs");
const mongoose = require("mongoose");

const db = mongoose.createConnection();
db.on("open", () => console.log("db is connected."));
db.on("close", () => console.log("db is disconnected."));
db.on("error", (err) => console.error(err));
db.openUri(process.env.MDB_NAME, {
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
  })
  .once("open", () => console.log("db connection is ok."))
  .on("error", (err) => console.error(err));

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

module.exports = db.model("Notice", noticeSchema);
