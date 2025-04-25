// Reply routes
const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');
const { isAuthenticated } = require('../utils/security');

// All reply routes are protected (require authentication)
router.post('/messages/:id/replies', isAuthenticated, replyController.createReply);
router.get('/messages/:id/replies', isAuthenticated, replyController.getRepliesByMessageId);

module.exports = router;
