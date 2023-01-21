const Notice = require("../models/notice");
const { User, Group } = require("../models/account");

function fetchNotice(category, noticeId) {
  return Notice.findOne()
    .where("category").equals(category)
    .where("noticeId").equals(noticeId)
    .select("accessTokenKey accessTokenSecret")
    .exec();
}

function fetchUser(username) {
  return User.findOne()
    .where("username").equals(username)
    .select("userId")
    .exec();
}

function upsertUser({ userId, username, timestamp }) {
  const filter = { userId };
  const update = { username, timestamp, type: "line" };
  const option = { upsert: true };
  return User.findOneAndUpdate(filter, update, option).exec();
}

function deleteUser({ userId }) {
  const conditions = { userId };
  return User.findOneAndDelete(conditions).exec();
}

function fetchGroup(groupname) {
  return Group.findOne()
    .where("groupname").equals(groupname)
    .select("groupId")
    .exec();
}

function upsertGroup({ groupId, groupname, timestamp }) {
  const filter = { groupId };
  const update = { groupname, timestamp, type: "line" };
  const option = { upsert: true };
  return Group.findOneAndUpdate(filter, update, option).exec();
}

function deleteGroup({ groupId }) {
  const conditions = { groupId };
  return Group.findOneAndDelete(conditions).exec();
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

function userMessage(client, username) {
  const message = { type: "text", text: "プッシュメッセージです！"}
  return fetchUser(username)
    .then(userId => client.pushMessage(userId, message));
}

function groupMessage(client, groupname) {
  const message = { type: "text", text: "プッシュメッセージです！"}
  return fetchGroup(groupname)
    .then(groupId => client.pushMessage(groupId, message));
}

function followMessage(client, token, user) {
  const message = { type: "text", text: `${user.username}さん、こんにちは！` };
  return upsertUser(user)
    .then(() => client.replyMessage(token, message));
}

function unfollowAccount(user) {
  return deleteUser(user);
}

function sendMessage(client, token, echo) {
  const message = { type: "text", text: echo };
  return client.replyMessage(token, message);
}

function joinMessage(client, token, group) {
  const message = { type: "text", text: `${group.groupname}へ、ようこそ！` };
  return upsertGroup(group)
    .then(() => client.replyMessage(token, message));
}

function leaveAccount(group) {
  return deleteGroup(group);
}

module.exports = {
  getLineClient,
  getLineMiddleware,
  broadcastMessage,
  userMessage,
  groupMessage,
  followMessage,
  unfollowAccount,
  sendMessage,
  joinMessage,
  leaveAccount,
};