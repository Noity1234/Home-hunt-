const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  serviceType: { type: String, enum: ['Cleaning', 'Repair'], required: true },
  description: { type: String, required: true },
  userName: { type: String, required: true },
  userContact: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Could be Pending, In Progress, Completed
  createdAt: { type: Date, default: Date.now }
});

const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);

module.exports = ServiceRequest;