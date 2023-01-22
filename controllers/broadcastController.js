const line = require("@line/bot-sdk");
const utils = require("../utils");
const log = require("log4js").getLogger("broadcast");

exports.index = async (_, res) => {
  try {
    const client = await utils.getLineClient(line);
    const result = await utils.broadcastMessage(client);
    log.info(`broadcast message ${result["x-line-request-id"]}`);
    res.json(result);
  } catch (err) {
    log.error("Broadcast error: ", err);
    res.status(500).end();
  }
};
