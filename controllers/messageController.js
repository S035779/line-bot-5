const line = require("@line/bot-sdk");
const utils = require("../utils");
const log = require("log4js").getLogger("message");

exports.user = async (req, res) => {
  try {
    const client = await utils.getLineClient(line);
    const result = await utils.userMessage(client, req.params.id);
    log.info(`user message ${result["x-line-request-id"]}`);
    res.json(result);
  } catch (err) {
    log.error("Push message error: ", err);
    res.status(500).end();
  }
};

exports.group = async (req, res) => {
  try {
    const client = await utils.getLineClient(line);
    const result = await utils.groupMessage(client, req.params.id);
    log.info(`group message ${result["x-line-request-id"]}`);
    res.json(result);
  } catch (err) {
    log.error("Push message error: ", err);
    res.status(500).end();
  }
};
