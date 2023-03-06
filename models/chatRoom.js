const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: [
    {
      message: String,
      isAdmin: Boolean,
    },
  ],
  isEnd: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("chatRoom", roomSchema);
