const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roles');
const { membershipGuard } = require('../middleware/membershipGuard');

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private (Admin only)
router.post('/', authMiddleware, requireRole('admin'), async (req, res, next) => {
  const { name, description, subject, maxMembers } = req.body;

  if (!name || !description || !subject || !maxMembers) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  if (maxMembers < 2 || maxMembers > 100) {
    return res.status(400).json({ error: 'maxMembers must be between 2 and 100' });
  }

  try {
    const group = await Group.create({
      name,
      description,
      subject,
      maxMembers,
      admin: req.user._id,
      members: [req.user._id] // Admin is implicitly a member
    });

    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/groups
// @desc    Get all groups
// @access  Private
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const groups = await Group.find().populate('admin', 'name').sort({ createdAt: -1 });
    
    // Format response to include isMember, memberCount, isFull
    const formattedGroups = groups.map(group => {
      const isMember = group.members.some(memberId => memberId.toString() === req.user._id.toString()) || 
                       (group.admin && group.admin._id.toString() === req.user._id.toString());
      const memberCount = group.members.length;
      const isFull = memberCount >= group.maxMembers;

      return {
        _id: group._id,
        name: group.name,
        description: group.description,
        subject: group.subject,
        maxMembers: group.maxMembers,
        admin: group.admin,
        memberCount,
        isMember,
        isFull
      };
    });

    res.json(formattedGroups);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/groups/:id/join
// @desc    Join a group
// @access  Private (Student only)
router.post('/:id/join', authMiddleware, requireRole('student'), async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    // First check if group exists and if user is already a member
    const groupCheck = await Group.findById(groupId);
    if (!groupCheck) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (groupCheck.members.includes(userId)) {
      return res.status(409).json({ error: 'Already a member' });
    }

    if (groupCheck.members.length >= groupCheck.maxMembers) {
        return res.status(409).json({ error: 'Group is full' });
    }

    // Atomic update to avoid race conditions
    const group = await Group.findOneAndUpdate(
      { 
        _id: groupId, 
        members: { $ne: userId }, 
        $expr: { $lt: [{ $size: "$members" }, "$maxMembers"] } 
      },
      { $addToSet: { members: userId } }, 
      { new: true }
    );

    if (!group) {
        // If null, it means it's either full, or user already member. 
        // We checked already, but concurrent request could have made it full.
        return res.status(409).json({ error: 'Group is full or you are already a member' });
    }

    res.json({ message: 'Successfully joined group', group });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/groups/:id
// @desc    Get specific group by ID
// @access  Private (Members or Admin Owner)
router.get('/:id', authMiddleware, membershipGuard, async (req, res) => {
  // membershipGuard attached req.group
  // Let's populate members and admin for the hub view
  await req.group.populate('admin', 'name');
  await req.group.populate('members', 'name role');
  
  res.json(req.group);
});

module.exports = router;
