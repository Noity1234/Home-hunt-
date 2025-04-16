const express = require("express");
const mongoose = require("mongoose");
const House = require("./models/House");
const ServiceRequest = require("./models/ServiceRequest");

const app = express();
app.use(express.json());  // For parsing application/json

// Connect to the database
mongoose.connect ("mongodb+srv://Noity1234:ACbd1234@backenddb.qthkb5k.mongodb.net/HomeHunt?retryWrites=true&w=majority&appName=BackendDB")
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
        const { title, latitude, longitude } = req.body;
        const house = new House({ title, latitude, longitude });
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

// API to request cleaning or repair services
app.post('/api/service-requests', async (req, res) => {
    try {
        const { houseId, serviceType, description, userName, userContact } = req.body;
        console.log("Received service request:", req.body);

        const house = await House.findById(houseId);
        if (!house) {
            console.log("House not found for ID:", houseId);
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
        console.log("Service request saved:", serviceRequest);

        res.status(201).json(serviceRequest);
    } catch (err) {
        console.error("Error while saving service request:", err);
        res.status(500).json({ error: 'Failed to request service' });
    }
});


// Start the server (only once)
app.listen(1345, () => {
    console.log("Server is running on port 1345");
});
