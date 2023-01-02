"use strict";

const line = require("@line/bot-sdk");
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

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

const Notice = db.model("Notice", noticeSchema);

function main(notice) {
  const config = { channelAccessToken: notice.accessTokenKey, channelSecret: notice.accessTokenSecret };
  const client = new line.Client(config);

  function broadcastMessage() {
    const message = { type: "text", text: "ブロードキャストメッセージです！" };
    return client.broadcast(message);
  }

  function pushMessage(userId) {
    const message = { type: "text", text: "プッシュメッセージです！"}
    return client.pushMessage(userId, message);
  }

  function followMessage(token, username) {
    const message = { type: "text", text: `${username}さん、こんにちは！` };
    return client.replyMessage(token, message);
  };

  function sendMessage(token, echo) {
    const message = { type: "text", text: echo };
    return client.replyMessage(token, message);
  };

  function joinMessage(token, groupname) {
    const message = { type: "text", text: `${groupname}へ、ようこそ！` };
    return client.replyMessage(token, message);
  };

  function handleEvent(event) {
    if (event.type === "follow") {
      return client.getProfile(event.source.userId)
        .then(profile => followMessage(event.replyToken, profile.displayName));
    }
  
    if (event.type === "message" && event.message.type === "text") {
      return sendMessage(event.replyToken, "これは、これは");
    }
  
    if (event.type === "join" && event.source.type === "group") {
      return client.getGroupSummary(event.source.groupId)
        .then(summary => joinMessage(event.replyToken, summary.groupName));
    }
  
    return Promise.resolve(null);
  };

  app.get("/", (_, res) => {
    return res.status(200).json({
      status: "success",
      message: "Connected successfully!"
    })
  });

  app.get("/broadcast", (_, res) => {
    broadcastMessage()
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  app.get("/message/:uid", (req, res) => {
    pushMessage(req.params.uid)
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  app.post("/bot/webhook", line.middleware(config), (req, res) => {
    console.dir(req.body, { depth: 10, colors: true });
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
};

function fetchNotice(category, noticeId) {
  return Notice.findOne()
    .where("category").equals(category)
    .where("noticeId").equals(noticeId)
    .select("accessTokenKey accessTokenSecret");
}

fetchNotice("line", 1)
  .then(notice => main(notice));