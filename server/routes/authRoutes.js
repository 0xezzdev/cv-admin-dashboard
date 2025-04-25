// Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../utils/security');

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Get current user route (protected)
router.get('/me', isAuthenticated, authController.getCurrentUser);

// Change password route (protected)
router.post('/change-password', isAuthenticated, authController.changePassword);

module.exports = router;
