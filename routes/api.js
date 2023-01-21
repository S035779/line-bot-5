const router = require("express").Router();
const messageController = require("../controllers/messageController");
const broadcastController = require("../controllers/broadcastController");
const userController = require("../controllers/userController");
const groupController = require("../controllers/groupController");

router.get("/broadcast", broadcastController.index);
router.get("/message/:uid", messageController.index);

router.get("/users", userController.index);
router.post("/user", userController.create);
router.get("/user/:id", userController.select);
router.patch("/user/:id", userController.update);
router.delete("/user/:id", userController.delete);

router.get("/groups", groupController.index);
router.post("/group", groupController.create);
router.get("/group/:id", groupController.select);
router.patch("/group/:id", groupController.update);
router.delete("/group/:id", groupController.delete);

module.exports = router;
