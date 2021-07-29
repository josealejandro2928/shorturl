const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    original_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("urls", urlSchema);

module.exports = Url;
