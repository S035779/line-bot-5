const line = require("@line/bot-sdk");
const utils = require("../utils");

exports.index = async (_, res) => {
  try {
    const client = await utils.getLineClient(line);
    const result = await utils.broadcastMessage(client);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
