// Message controller
const { db } = require('../config/db');

// Get all messages
const getAllMessages = (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, messages) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.status(200).json({ messages });
  });
};

// Get a single message by ID
const getMessageById = (req, res) => {
  const messageId = req.params.id;
  
  // Get message details
  db.get('SELECT * FROM messages WHERE id = ?', [messageId], (err, message) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Get replies for this message
    db.all('SELECT * FROM replies WHERE message_id = ? ORDER BY created_at ASC', [messageId], (err, replies) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      // Mark message as read if it wasn't already
      if (!message.read) {
        db.run('UPDATE messages SET read = 1 WHERE id = ?', [messageId]);
      }
      
      res.status(200).json({
        message,
        replies
      });
    });
  });
};

// Create a new message (from contact form)
const createMessage = (req, res) => {
  const { sender_name, sender_email, subject, content } = req.body;
  
  // Validate input
  if (!sender_name || !sender_email || !subject || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Insert message into database
  db.run(
    'INSERT INTO messages (sender_name, sender_email, subject, content) VALUES (?, ?, ?, ?)',
    [sender_name, sender_email, subject, content],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.status(201).json({
        message: 'Message sent successfully',
        messageId: this.lastID
      });
    }
  );
};

// Delete a message
const deleteMessage = (req, res) => {
  const messageId = req.params.id;
  
  // Delete all replies for this message first
  db.run('DELETE FROM replies WHERE message_id = ?', [messageId], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Then delete the message
    db.run('DELETE FROM messages WHERE id = ?', [messageId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      res.status(200).json({ message: 'Message deleted successfully' });
    });
  });
};

// Mark message as read
const markAsRead = (req, res) => {
  const messageId = req.params.id;
  
  db.run('UPDATE messages SET read = 1 WHERE id = ?', [messageId], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.status(200).json({ message: 'Message marked as read' });
  });
};

// Get message statistics
const getMessageStats = (req, res) => {
  db.get('SELECT COUNT(*) as total FROM messages', [], (err, totalResult) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    db.get('SELECT COUNT(*) as unread FROM messages WHERE read = 0', [], (err, unreadResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      db.get('SELECT COUNT(*) as replied FROM messages WHERE replied = 1', [], (err, repliedResult) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        res.status(200).json({
          total: totalResult.total,
          unread: unreadResult.unread,
          replied: repliedResult.replied
        });
      });
    });
  });
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  deleteMessage,
  markAsRead,
  getMessageStats
};
