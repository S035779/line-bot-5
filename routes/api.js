const router = require("express").Router();
const messageController = require("../controllers/messageController");
const broadcastController = require("../controllers/broadcastController");

router.get("/broadcast", broadcastController.index);
router.get("/message/:uid", messageController.index);

module.exports = router;
