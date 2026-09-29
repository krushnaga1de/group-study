const express = require('express');
const router = express.Router({ mergeParams: true }); // Important to access :id from parent router
const StudySession = require('../models/StudySession');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roles');
const { membershipGuard } = require('../middleware/membershipGuard');

// @route   POST /api/groups/:id/sessions
// @desc    Create a study session for a group
// @access  Private (Owning Admin only)
router.post('/', authMiddleware, membershipGuard, async (req, res, next) => {
  try {
    // membershipGuard ensures user is either member or owner.
    // Now we specifically require it's the owning admin.
    const group = req.group;
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the group admin can schedule sessions' });
    }

    const { subject, date, time, meetingDetails } = req.body;

    if (!subject || !date || !time || !meetingDetails) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Validate date/time is in the future
    const sessionDateTime = new Date(`${date}T${time}`);
    if (sessionDateTime < new Date()) {
      return res.status(400).json({ error: 'Session date and time must be in the future' });
    }

    const session = await StudySession.create({
      group: group._id,
      subject,
      date,
      time,
      meetingDetails,
      createdBy: req.user._id
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/groups/:id/sessions
// @desc    Get all study sessions for a group
// @access  Private (Members or Admin Owner)
router.get('/', authMiddleware, membershipGuard, async (req, res, next) => {
  try {
    const sessions = await StudySession.find({ group: req.params.id })
      .populate('createdBy', 'name')
      .sort({ date: 1, time: 1 });
      
    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
