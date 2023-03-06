const express = require("express");
const ChatController = require("../controllers/chat");
const { verifyConselors } = require("../middlewares/verifyDecentralization");
const router = express.Router();

//POST new rooom
router.post("/newRoom", ChatController.createNewChatRoom);
//PUT add message
router.put("/addMessage", ChatController.addMessage);
//GET all list room
router.get("/roomOpen", verifyConselors, ChatController.getAllRoomIsOpen);
//GET message
router.get("/room/:roomId", ChatController.getMessageByRoomId);

module.exports = router;
