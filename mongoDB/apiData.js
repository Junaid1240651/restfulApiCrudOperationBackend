const mongoose = require("mongoose");

const apiData = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  company: { type: String },
  website: { type: String },
  address: { type: String },
  avatar: { type: String },
});
module.exports = mongoose.model("apiData", apiData);
