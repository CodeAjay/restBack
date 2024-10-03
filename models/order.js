const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Order Schema
const order = new Schema({
  orderId: {
    type: String,
    unique: true,  // Ensure the orderId is unique
    required: true // Order ID must be present
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  name: { type: String },
  address: { type: String },
  email: { type: String },
});

module.exports = mongoose.model("Order", order);
