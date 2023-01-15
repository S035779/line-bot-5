const line = require("@line/bot-sdk");
const utils = require("../utils");
const log = require("log4js").getLogger("message");

exports.index = async (req, res) => {
  log.debug("This is in the message module");
  try {
    const client = await utils.getLineClient(line);
    const result = await utils.userMessage(client, req.params.uid);
    res.json(result);
  } catch (err) {
    log.error("Push message error: ", err);
    res.status(500).end();
  }
};
