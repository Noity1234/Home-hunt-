const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST - Create a review
router.post('/', async (req, res) => {
  const { name, comment, rating } = req.body;

  if (!name || !comment || !rating) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const review = new Review({ name, comment, rating });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error saving review', error });
  }
});

// GET - All reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

module.exports = router;
