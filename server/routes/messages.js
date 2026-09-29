const express = require('express');
const router = express.Router({ mergeParams: true });
const Message = require('../models/Message');
const { authMiddleware } = require('../middleware/authMiddleware');
const { membershipGuard } = require('../middleware/membershipGuard');

// @route   POST /api/groups/:id/messages
// @desc    Post a message to a group
// @access  Private (Members or Admin Owner)
router.post('/', authMiddleware, membershipGuard, async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await Message.create({
      group: req.params.id,
      author: req.user._id,
      content
    });

    await message.populate('author', 'name role');

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/groups/:id/messages
// @desc    Get all messages for a group
// @access  Private (Members or Admin Owner)
router.get('/', authMiddleware, membershipGuard, async (req, res, next) => {
  try {
    const messages = await Message.find({ group: req.params.id })
      .populate('author', 'name role')
      .sort({ createdAt: -1 }); // newest first
      
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
