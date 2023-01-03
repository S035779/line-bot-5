const line = require("@line/bot-sdk");
const router = require("express").Router();
const webhookController = require("../controllers/webhookController");
const utils = require("../utils");

router.post("/webhook", utils.getLineMiddleware(line), webhookController.index);

module.exports = router;
