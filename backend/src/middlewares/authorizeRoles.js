const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user object exists (should be added by protect middleware)
    if (!req.user) {
      return res.status(500).json({
        message: 'User not authenticated or user information not available'
      });
    }

    // Check if the user's role is included in the allowed roles
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `User role ${userRole} is not authorized to access this route`
      });
    }

    // If authorized, proceed to the next middleware or route handler
    next();
  };
};

export {
  authorizeRoles
};
