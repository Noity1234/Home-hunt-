// models/House.js
const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  price: { type: Number, required: true },              
  petFriendly: { type: Boolean, default: false },       
  location: { type: String, required: true },
});


const House = mongoose.model('House', HouseSchema);

module.exports = House;
