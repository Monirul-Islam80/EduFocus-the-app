const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController.js");
const router = express.Router();
console.log("Message route");

router.post("/", sendMessage);
router.get("/:chatId", allMessages);
module.exports = router;
