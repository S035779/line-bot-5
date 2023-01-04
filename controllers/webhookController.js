const line = require("@line/bot-sdk");
const utils = require("../utils");
const log = require("log4js").getLogger("bot");

function handleEvent(client, event) {
  if (event.type === "follow") {
    return client.getProfile(event.source.userId)
      .then(profile => utils.followMessage(client, event.replyToken, profile.displayName))
      .catch(err => log.error("Follow message error: ", err));
  }

  if (event.type === "message" && event.message.type === "text") {
    return utils.sendMessage(client, event.replyToken, "これは、これは")
      .catch(err => log.error("Send message error: ", err));
  }

  if (event.type === "join" && event.source.type === "group") {
    return client.getGroupSummary(event.source.groupId)
      .then(summary => utils.joinMessage(client, event.replyToken, summary.groupName))
      .catch(err => log.error("Join message error: ", err));
  }

  return Promise.resolve(null);
}

exports.index = async (req, res) => {
  console.dir(req.body, { depth: 10, colors: true });
  log.debug("This is in the webhook module");
  
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
