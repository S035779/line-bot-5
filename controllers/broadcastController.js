const line = require("@line/bot-sdk");
const utils = require("../utils");
const log = require("log4js").getLogger("broadcast");

exports.index = async (_, res) => {
  log.debug("This is in the broadcast module");
  try {
    const client = await utils.getLineClient(line);
    const result = await utils.broadcastMessage(client);
    res.json(result);
  } catch (err) {
    log.error("Broadcast error: ", err);
    res.status(500).end();
  }
};
