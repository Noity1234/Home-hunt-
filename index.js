


const uploadRoutes = require('./routes/upload');

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // Import cors
const House = require("./models/House");
const ServiceRequest = require("./models/ServiceRequest");
const Booking = require('./models/Booking');
const reviewRoutes = require('./routes/reviewRoutes');
const eventRoutes = require('./routes/event.routes');


const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());  // Add this line to enable CORS for all routes

app.use(express.json());  // For parsing application/json

app.use('/api/events', eventRoutes);
 


// Connect to the database
mongoose.connect("mongodb+srv://Noity1234:ACbd1234@backenddb.qthkb5k.mongodb.net/HomeHunt?retryWrites=true&w=majority&appName=BackendDB")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection Failed!", err.message);
  });

// Basic test route
app.get('/', (req, res) => {
    res.send('Hello from Node API Server');
});



// GET all house locations (title, latitude, longitude)
app.get('/api/houses/locations', async (req, res) => {
    try {
        const houses = await House.find({}, 'title latitude longitude');
        res.json(houses);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ NEW: Get all houses
app.get('/api/houses', async (req, res) => {
    try {
        const houses = await House.find(); // Return all houses
        res.json(houses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch houses' });
    }
});




// GET a specific house by ID
app.get('/api/houses/:id', async (req, res) => {
    try {
        const houseId = req.params.id;
        const house = await House.findById(houseId);
        if (!house) {
            return res.status(404).json({ error: 'House not found' });
        }
        res.json(house);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST a new house
app.post('/api/houses', async (req, res) => {
    try {
        const { title, latitude, longitude, price, petFriendly, location } = req.body;

        const house = new House({ title, latitude, longitude, price, petFriendly, location });

        await house.save();

        res.status(201).json(house);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save house' });
    }
});

// FILTER API - Get houses based on filters
app.post('/api/houses/filter', async (req, res) => {
    try {
        const { minPrice, maxPrice, petFriendly, location } = req.body;
        const filter = {};

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }

        if (petFriendly === true) {
            filter.petFriendly = petFriendly;
        }

        if (location) {
            filter.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive search
        }

        const houses = await House.find(filter);
        res.json(houses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});





// UPDATE a house
app.put('/api/houses/:id', async (req, res) => {
    try {
        const { title, latitude, longitude, price, petFriendly, location } = req.body;
        const updatedHouse = await House.findByIdAndUpdate(
            req.params.id,
            { title, latitude, longitude, price, petFriendly, location },
            { new: true }
        );

        if (!updatedHouse) {
            return res.status(404).json({ error: 'House not found' });
        }

        res.json(updatedHouse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update house' });
    }
});

// DELETE a house
app.delete('/api/houses/:id', async (req, res) => {
    try {
        const deletedHouse = await House.findByIdAndDelete(req.params.id);

        if (!deletedHouse) {
            return res.status(404).json({ error: 'House not found' });
        }

        res.json({ message: 'House deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete house' });
    }
});


// API to request cleaning or repair services
app.post('/api/service-requests', async (req, res) => {
    try {
        const { houseId, serviceType, description, userName, userContact } = req.body;

        const house = await House.findById(houseId);
        if (!house) {
            return res.status(404).json({ error: 'House not found' });
        }

        const serviceRequest = new ServiceRequest({
            houseId,
            serviceType,
            description,
            userName,
            userContact
        });

        await serviceRequest.save();
        res.status(201).json(serviceRequest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to request service' });
    }
});

// API to create a booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { userName, userContact, userEmail, houseId, bookingDate } = req.body;

        const house = await House.findById(houseId);
        if (!house) {
            return res.status(404).json({ error: 'House not found' });
        }

        const booking = new Booking({
            userName,
            userContact,
            userEmail, // <-- Add this!
            houseId,
            bookingDate
        });

        await booking.save();

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});


// API to cancel a booking
app.post('/api/bookings/cancel', async (req, res) => {
    try {
        const { bookingId, cancellationDate } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        const bookingDate = new Date(booking.bookingDate);
        const cancelDate = new Date(cancellationDate);

        const timeDifference = bookingDate.getTime() - cancelDate.getTime();
        const daysBefore = Math.ceil(timeDifference / (1000 * 3600 * 24));

        let refundPercentage = 0;

        if (daysBefore >= 7) {
            refundPercentage = 100;
        } else if (daysBefore >= 1 && daysBefore <= 6) {
            refundPercentage = 95;
        } else {
            refundPercentage = 0; // too late for refund
        }

        // Update booking status
        booking.status = 'Cancelled';
        await booking.save();

        return res.json({
            message: 'Booking cancelled successfully',
            refundPercentage
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// NEW: Get all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find(); // Find all bookings
        res.json(bookings); // Send them back as JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

app.use('/api/reviews', reviewRoutes);


app.use('/api', uploadRoutes); // ⬅️ register the routes under /api

// Get all events (you can filter based on dates if needed)
app.get('/api/events', async (req, res) => {
    try {
      const events = await Event.find(); // Fetch all events from MongoDB
      res.json(events); // Send events as response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  });


  // Express.js Route Example
app.get('/api/events', async (req, res) => {
    try {
      const events = await Event.find();  // Fetch all events without filtering
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


// Start the server
app.listen(1345, () => {
    console.log("Server is running on port 1345");
});
