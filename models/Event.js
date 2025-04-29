const mongoose = require('mongoose');

// Define the Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  community: {
    type: String,
    enum: ['Muslim', 'Hindu', 'Christian','General'],  // You can expand this later if needed
    required: true
  },
  description: {
    type: String,  // Optional field for event description
    default: ''    // Optional, you can set it to an empty string if not provided
  },
  date: {
    type: Date,
    required: true
  },
  isPublicHoliday: {
    type: Boolean,
    default: false  // Indicates whether this event is a public holiday
  }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

// Create and export the Event model
module.exports = mongoose.model('Event', eventSchema);
