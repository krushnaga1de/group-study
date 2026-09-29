const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: Requires ${role} role` });
    }
    
    next();
  };
};

module.exports = { requireRole };
