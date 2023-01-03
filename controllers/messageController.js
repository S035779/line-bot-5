const line = require("@line/bot-sdk");
const utils = require("../utils");

exports.index = async (req, res) => {
  try {
    const client = await utils.getLineClient(line);
    const result = await utils.pushMessage(client, req.params.uid);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
