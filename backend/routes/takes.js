const express = require('express');
const mongoose = require('mongoose');
const HotTake = require('../models/HotTake');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Create a new take
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'text is required and cannot be empty' });
    }

    if (text.trim().length > 280) {
      return res.status(400).json({ error: 'text must be 280 characters or fewer' });
    }

    const take = await HotTake.create({ text: text.trim() });
    res.status(201).json(take);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create take' });
  }
});

// Get all takes, newest first
router.get('/', async (req, res) => {
  try {
    const takes = await HotTake.find().sort({ createdAt: -1 });
    res.json(takes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch takes' });
  }
});

// Agree with a take
router.patch('/:id/agree', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid take ID' });
    }

    const take = await HotTake.findByIdAndUpdate(
      id,
      { $inc: { agrees: 1 } },
      { new: true }
    );

    if (!take) {
      return res.status(404).json({ error: 'Take not found' });
    }

    res.json(take);
  } catch (err) {
    res.status(500).json({ error: 'Failed to agree' });
  }
});

// Disagree with a take
router.patch('/:id/disagree', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid take ID' });
    }

    const take = await HotTake.findByIdAndUpdate(
      id,
      { $inc: { disagrees: 1 } },
      { new: true }
    );

    if (!take) {
      return res.status(404).json({ error: 'Take not found' });
    }

    res.json(take);
  } catch (err) {
    res.status(500).json({ error: 'Failed to disagree' });
  }
});

module.exports = router;