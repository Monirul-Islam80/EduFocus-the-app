const express = require("express");
const {
  allUsers,
  accessChat,
  fetchChats,
  removeFromGroup,
  addToGroup,
  createGroup,
  renameGroup,
  fetchChatList,
} = require("../controllers/chatController");

const router = express.Router();
console.log("Chat routes initialized");

router.get("/", allUsers);
router.post("/", accessChat);
router.get("/fetch", fetchChats);
router.get("/chatList", fetchChatList);
router.post("/group", (req, res) => createGroup(req, res));
router.put("/group/rename", (req, res) => renameGroup(req, res));
router.put("/group/add", (req, res) => addToGroup(req, res));
router.put("/group/remove", (req, res) => removeFromGroup(req, res));
module.exports = router;
