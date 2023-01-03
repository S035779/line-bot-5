const line = require("@line/bot-sdk");
const utils = require("../utils");

function handleEvent(client, event) {
  if (event.type === "follow") {
    return client.getProfile(event.source.userId)
      .then(profile => utils.followMessage(client, event.replyToken, profile.displayName));
  }

  if (event.type === "message" && event.message.type === "text") {
    return utils.sendMessage(client, event.replyToken, "これは、これは");
  }

  if (event.type === "join" && event.source.type === "group") {
    return client.getGroupSummary(event.source.groupId)
      .then(summary => utils.joinMessage(client, event.replyToken, summary.groupName));
  }

  return Promise.resolve(null);
}

exports.index = async (req, res) => {
  console.dir(req.body, { depth: 10, colors: true });
  
  const client = await utils.getLineClient(line);
  await Promise
    .all(req.body.events.map(event => handleEvent(client, event)))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
};
