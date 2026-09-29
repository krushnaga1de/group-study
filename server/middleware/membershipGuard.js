const Group = require('../models/Group');

const membershipGuard = async (req, res, next) => {
  try {
    const groupId = req.params.id; // Assume group id is in req.params.id
    if (!groupId) {
      return res.status(400).json({ error: 'Group ID is required' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isOwner = group.admin.toString() === req.user._id.toString();
    const isMember = group.members.some(memberId => memberId.toString() === req.user._id.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'Access denied - join this group first' });
    }

    // Attach group to request object so next route handler doesn't have to fetch it again
    req.group = group;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error verifying membership' });
  }
};

module.exports = { membershipGuard };
