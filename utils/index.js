const Notice = require("../models/notice");

function fetchNotice(category, noticeId) {
  return Notice.findOne()
    .where("category").equals(category)
    .where("noticeId").equals(noticeId)
    .select("accessTokenKey accessTokenSecret");
}

function getLineClient(line) {
  return fetchNotice("line", 1)
    .then(notice => ({
      channelAccessToken: notice.accessTokenKey,
      channelSecret: notice.accessTokenSecret
    }))
    .then(config => new line.Client(config));
}

function getLineMiddleware(line) {
  return (req, res, next) => {
    fetchNotice("line", 1)
      .then(notice => ({
        channelAccessToken: notice.accessTokenKey,
        channelSecret: notice.accessTokenSecret
      }))
      .then(config => line.middleware(config))
      .then(callback => callback(req, res, next));
  };
}

function broadcastMessage(client) {
  const message = { type: "text", text: "ブロードキャストメッセージです！" };
  return client.broadcast(message);
}

function pushMessage(client,  userId) {
  const message = { type: "text", text: "プッシュメッセージです！"}
  return client.pushMessage(userId, message);
}

function followMessage(client, token, username) {
  const message = { type: "text", text: `${username}さん、こんにちは！` };
  return client.replyMessage(token, message);
}

function sendMessage(client, token, echo) {
  const message = { type: "text", text: echo };
  return client.replyMessage(token, message);
}

function joinMessage(client, token, groupname) {
  const message = { type: "text", text: `${groupname}へ、ようこそ！` };
  return client.replyMessage(token, message);
}

module.exports = {
  getLineClient,
  getLineMiddleware,
  broadcastMessage,
  pushMessage,
  followMessage,
  sendMessage,
  joinMessage,
};