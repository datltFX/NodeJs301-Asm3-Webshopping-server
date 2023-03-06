const ChatRoom = require("../models/chatRoom");

class ChatControlller {
  //create new roomchat
  createNewChatRoom = async (req, res, next) => {
    // console.log("-----6666-----", req.body);
    try {
      const newRoom = new ChatRoom({
        userId: req.body._id,
      });

      const room = await newRoom.save();
      // console.log(room);
      res.status(200).json({ msg: "New chat room created", room: room });
    } catch (err) {
      console.log(err);
    }
  };

  //get messager for a user
  getMessageByRoomId = async (req, res, next) => {
    try {
      const room = await ChatRoom.findById(req.params.roomId).populate(
        "userId"
      );
      res.status(200).json(room);
    } catch (err) {
      console.log(err);
    }
  };

  //add message
  addMessage = async (req, res, next) => {
    // console.log("------333-----", req.body);
    try {
      if (req.body.message === "/end") {
        await ChatRoom.findByIdAndUpdate(req.body.roomId, {
          $set: {
            isEnd: true,
          },
        });
        return res.status(200).json("End chat success!");
      }
      await ChatRoom.findByIdAndUpdate(req.body.roomId, {
        $push: {
          message: {
            message: req.body.message,
            isAdmin: req.body.isAdmin,
          },
        },
      });
      res.status(200).json("Save message success!");
    } catch (err) {
      console.log(err);
    }
  };
  //all list room
  getAllRoomIsOpen = async (req, res, next) => {
    try {
      const roomOpen = await ChatRoom.find({ isEnd: false }).populate("userId");
      res.status(200).json(roomOpen);
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = new ChatControlller();
