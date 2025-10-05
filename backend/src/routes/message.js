const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController.JS");
const router = express.Router();
console.log("Message route");

router.post("/", sendMessage);
router.get("/:chatId", allMessages);
module.exports = router;
