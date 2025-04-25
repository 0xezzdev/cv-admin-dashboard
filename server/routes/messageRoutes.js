const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get all messages
router.get('/', messageController.getAllMessages);

// Get a single message by ID
router.get('/:id', messageController.getMessageById);

// Create a new message (from contact form)
router.post('/', messageController.createMessage);

// Delete a message
router.delete('/:id', messageController.deleteMessage);

// Mark message as read
router.put('/:id/read', messageController.markAsRead);

// Get message statistics
router.get('/stats', messageController.getMessageStats);

module.exports = router;
