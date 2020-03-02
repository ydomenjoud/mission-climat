const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  isNewsletter: Boolean,
  scenarios: Array
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;