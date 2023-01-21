const line = require("@line/bot-sdk");
const utils = require("../utils");
const log = require("log4js").getLogger("bot");

function handleEvent(client, { replyToken, type, mode, timestamp, source, webhookEventId, deliveryContext, message }) {
  switch (type) {
    case "follow":
      if (source.type !== "user") break;
      log.info(`${replyToken} ${type} ${mode} ${timestamp} ${source.type} ${source.userId} ${webhookEventId} ${deliveryContext.isRedelivery}`);
      return client.getProfile(source.userId)
        .then(profile => utils.followMessage(client, replyToken, { userId: source.userId, username: profile.displayName, timestamp }))
        .catch(err => log.error("Follow message error: ", err));
    case "unfollow":
      if (source.type !== "user") break;
      log.info(`${type} ${mode} ${timestamp} ${source.type} ${source.userId} ${webhookEventId} ${deliveryContext.isRedelivery}`);
      return utils.unfollowAccount(client, { userId: source.userId, timestamp })
        .catch(err => log.error("Unfollow message error: ", err));
    case "message":
      if (message.type !== "text") break;
      log.info(`${replyToken} ${type} ${mode} ${timestamp} ${source.type} ${source.userId} ${webhookEventId} ${deliveryContext.isRedelivery} ${message.text}`);
      return utils.sendMessage(client, replyToken, "これは、これは")
        .catch(err => log.error("Send message error: ", err));
    case "join":
      if (source.type !== "group") break;
      log.info(`${replyToken} ${type} ${mode} ${timestamp} ${source.type} ${source.groupId} ${webhookEventId} ${deliveryContext.isRedelivery}`);
      return client.getGroupSummary(source.groupId)
        .then(summary => utils.joinMessage(client, replyToken, { groupId: source.groupId, groupname: summary.groupName, timestamp }))
        .catch(err => log.error("Join message error: ", err));
    case "leave":
      if (source.type !== "group") break;
      log.info(`${type} ${mode} ${timestamp} ${source.type} ${source.groupId} ${webhookEventId} ${deliveryContext.isRedelivery}`);
      return utils.leaveAccount({ groupId: source.groupId, timestamp })
        .catch(err => log.error("Leave message error: ", err));
  }
  return Promise.resolve(null);
}

exports.index = async (req, res) => {
  console.dir(req.body, { depth: 10, colors: true });
  
  try {
    const client = await utils.getLineClient(line);
    await Promise
      .all(req.body.events.map(event => handleEvent(client, event)))
      .then(result => res.json(result))
      .catch(err => log.error("Event handler error: ", err));
  } catch (err) {
    log.error("Webhook error: ", err);
    res.status(500).end();
  }
};
