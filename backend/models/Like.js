const mongoose = require("mongoose");
mongoose.set("debug", true);
const likeSchema = mongoose.Schema({
  userId: { type: String, required: true },
  like: { type: Number, default: 0 },
});

module.exports = mongoose.model("Like", likeSchema);
