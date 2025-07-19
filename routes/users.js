const express = require('express');
const router = express.Router();
const { getPreferences, updatePreferences } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Get user preferences (protected route)
router.get('/preferences', authenticateToken, getPreferences);

// Update user preferences (protected route)
router.put('/preferences', authenticateToken, updatePreferences);

module.exports = router; 