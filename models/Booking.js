
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userContact: {
        type: String,
        required: true
    },
    userEmail: { // <-- Add this field
        type: String,
        required: true
    },
    houseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;


