// models/House.js
const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  price: { type: Number, required: true },              // 💰 New field
  petFriendly: { type: Boolean, default: false },       // 🐶 New field
  location: { type: String, required: true },
});

// Mongoose automatically adds _id to every document, so no need to define it manually
const House = mongoose.model('House', HouseSchema);

module.exports = House;
