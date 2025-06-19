const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  price: Number,
  description: String,
});

module.exports = mongoose.model("Product", productSchema);
