// Reply controller
const { db } = require('../config/db');
const { sendReplyToSender } = require('../utils/email');

// Create a reply to a message
const createReply = (req, res) => {
  const messageId = req.params.id;
  const { content } = req.body;
  
  // Validate input
  if (!content) {
    return res.status(400).json({ message: 'Reply content is required' });
  }
  
  // Get the original message
  db.get('SELECT * FROM messages WHERE id = ?', [messageId], (err, message) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Insert reply into database
    db.run(
      'INSERT INTO replies (message_id, content) VALUES (?, ?)',
      [messageId, content],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        const replyId = this.lastID;
        
        // Mark message as replied
        db.run('UPDATE messages SET replied = 1 WHERE id = ?', [messageId], async (err) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          
          // Get the newly created reply
          db.get('SELECT * FROM replies WHERE id = ?', [replyId], async (err, reply) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ message: 'Server error' });
            }
            
            // Send email to the message sender
            try {
              await sendReplyToSender(message, reply);
              
              res.status(201).json({
                message: 'Reply sent successfully',
                reply
              });
            } catch (error) {
              console.error('Error sending email:', error);
              
              // Still return success even if email fails
              res.status(201).json({
                message: 'Reply saved but email notification failed',
                reply
              });
            }
          });
        });
      }
    );
  });
};

// Get all replies for a message
const getRepliesByMessageId = (req, res) => {
  const messageId = req.params.id;
  
  db.all('SELECT * FROM replies WHERE message_id = ? ORDER BY created_at ASC', [messageId], (err, replies) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.status(200).json({ replies });
  });
};

module.exports = {
  createReply,
  getRepliesByMessageId
};
