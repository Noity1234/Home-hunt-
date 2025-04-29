const express = require('express');
const router = express.Router();
const House = require('../models/House'); // Link to your House model

// CREATE
router.post('/', async (req, res) => {
  try {
    const newHouse = new House(req.body);
    const savedHouse = await newHouse.save();
    res.status(201).json(savedHouse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all houses
router.get('/', async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ house by ID
router.get('/:id', async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ error: 'House not found' });
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHouse) return res.status(404).json({ error: 'House not found' });
    res.json(updatedHouse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deletedHouse = await House.findByIdAndDelete(req.params.id);
    if (!deletedHouse) return res.status(404).json({ error: 'House not found' });
    res.json({ message: 'House deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
