// Message routes
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAuthenticated } = require('../utils/security');

// Public route for creating messages (from contact form)
router.post('/', messageController.createMessage);

// Protected routes (require authentication)
router.get('/', isAuthenticated, messageController.getAllMessages);
router.get('/stats', isAuthenticated, messageController.getMessageStats);
router.get('/:id', isAuthenticated, messageController.getMessageById);
router.delete('/:id', isAuthenticated, messageController.deleteMessage);
router.patch('/:id/read', isAuthenticated, messageController.markAsRead);

module.exports = router;
