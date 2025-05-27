const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  online: Boolean,
});

module.exports = mongoose.model("User", UserSchema);
