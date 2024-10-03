// models/restaurant.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  openingHours: { type: String, required: true },
  description: { type: String },
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
