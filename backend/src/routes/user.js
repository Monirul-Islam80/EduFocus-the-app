const express = require("express");
const {
  getProfile,
  createTodo,
  getTodo,
} = require("../controllers/userController");
const router = express.Router();

router.get("/profile", getProfile);
router.get("/todos/:userId", getTodo);
router.post("/todos", createTodo);
module.exports = router;
