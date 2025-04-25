// Messages JavaScript for admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/messages')
    .then(response => response.json())
    .then(data => {
      const messagesList = document.getElementById('messages-list');
      if (data.messages.length > 0) {
        data.messages.forEach(message => {
          const messageItem = document.createElement('div');
          messageItem.classList.add('message-item');
          messageItem.innerHTML = `
            <h4>${message.sender_name}</h4>
            <p>${message.subject}</p>
            <p>${message.content}</p>
          `;
          messagesList.appendChild(messageItem);
        });
      } else {
        messagesList.innerHTML = 'No messages found.';
      }
    })
    .catch(error => console.error('Error fetching messages:', error));
});
// Load all messages for the messages page
function loadAllMessages(filter = 'all') {
  const messagesList = document.getElementById('messages-list');
  
  fetch('/api/messages', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load messages');
    }
    return response.json();
  })
  .then(data => {
    // Clear loading indicator
    messagesList.innerHTML = '';
    
    // Filter messages if needed
    let filteredMessages = data.messages;
    if (filter === 'unread') {
      filteredMessages = data.messages.filter(message => !message.read);
    } else if (filter === 'read') {
      filteredMessages = data.messages.filter(message => message.read && !message.replied);
    } else if (filter === 'replied') {
      filteredMessages = data.messages.filter(message => message.replied);
    }
    
    if (filteredMessages.length === 0) {
      messagesList.innerHTML = '<div class="no-messages">No messages found</div>';
      return;
    }
    
    // Create message items
    filteredMessages.forEach(message => {
      const messageItem = document.createElement('div');
      messageItem.className = `message-item ${message.read ? '' : 'unread'}`;
      messageItem.dataset.id = message.id;
      
      // Format date
      const date = new Date(message.created_at);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      
      messageItem.innerHTML = `
        <div class="message-item-header">
          <div class="message-sender">${message.sender_name}</div>
          <div class="message-date">${formattedDate}</div>
        </div>
        <div class="message-subject">${message.subject}</div>
        <div class="message-preview">${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}</div>
      `;
      
      // Add click event to navigate to message detail
      messageItem.addEventListener('click', function() {
        window.location.href = `/message/${message.id}`;
      });
      
      messagesList.appendChild(messageItem);
    });
  })
  .catch(error => {
    console.error('Error loading messages:', error);
    messagesList.innerHTML = '<div class="error">Failed to load messages</div>';
  });
}

// Setup message filters
function setupMessageFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Load messages with selected filter
      const filter = this.dataset.filter;
      loadAllMessages(filter);
    });
  });
}

// Load message details for the message detail page
function loadMessageDetails(messageId) {
  const messageContent = document.getElementById('message-content');
  const repliesList = document.getElementById('replies-list');
  
  fetch(`/api/messages/${messageId}`, {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load message');
    }
    return response.json();
  })
  .then(data => {
    // Clear loading indicator
    messageContent.innerHTML = '';
    
    // Format date
    const date = new Date(data.message.created_at);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    // Display message details
    messageContent.innerHTML = `
      <div class="message-info">
        <div class="message-info-item">
          <span class="message-info-label">From:</span>
          <span>${data.message.sender_name} (${data.message.sender_email})</span>
        </div>
        <div class="message-info-item">
          <span class="message-info-label">Subject:</span>
          <span>${data.message.subject}</span>
        </div>
        <div class="message-info-item">
          <span class="message-info-label">Date:</span>
          <span>${formattedDate}</span>
        </div>
      </div>
      <div class="message-body">${data.message.content}</div>
    `;
    
    // Display replies
    if (data.replies && data.replies.length > 0) {
      repliesList.innerHTML = '';
      
      data.replies.forEach(reply => {
        const replyDate = new Date(reply.created_at);
        const formattedReplyDate = replyDate.toLocaleDateString() + ' ' + replyDate.toLocaleTimeString();
        
        const replyItem = document.createElement('div');
        replyItem.className = 'reply-item';
        replyItem.innerHTML = `
          <div class="reply-date">Replied on ${formattedReplyDate}</div>
          <div class="reply-content">${reply.content}</div>
        `;
        
        repliesList.appendChild(replyItem);
      });
    } else {
      repliesList.innerHTML = '<div class="no-replies">No replies yet</div>';
    }
  })
  .catch(error => {
    console.error('Error loading message details:', error);
    messageContent.innerHTML = '<div class="error">Failed to load message details</div>';
  });
}

// Setup reply form
function setupReplyForm(messageId) {
  const replyForm = document.querySelector('.reply-form');
  const replyContent = document.getElementById('reply-content');
  const sendReplyBtn = document.getElementById('send-reply-btn');
  const replyStatus = document.getElementById('reply-status');
  
  sendReplyBtn.addEventListener('click', function() {
    const content = replyContent.value.trim();
    
    if (!content) {
      replyStatus.textContent = 'Please enter a reply message';
      replyStatus.className = 'status-message error';
      return;
    }
    
    // Disable button during submission
    sendReplyBtn.disabled = true;
    sendReplyBtn.textContent = 'Sending...';
    
    // Send reply
    fetch(`/api/messages/${messageId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ content })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send reply');
      }
      return response.json();
    })
    .then(data => {
      // Show success message
      replyStatus.textContent = 'Reply sent successfully';
      replyStatus.className = 'status-message success';
      
      // Clear form
      replyContent.value = '';
      
      // Reload message details to show the new reply
      loadMessageDetails(messageId);
      
      // Reset button
      sendReplyBtn.disabled = false;
      sendReplyBtn.textContent = 'Send Reply';
    })
    .catch(error => {
      console.error('Error sending reply:', error);
      replyStatus.textContent = 'Failed to send reply. Please try again.';
      replyStatus.className = 'status-message error';
      
      // Reset button
      sendReplyBtn.disabled = false;
      sendReplyBtn.textContent = 'Send Reply';
    });
  });
}

// Setup delete button
function setupDeleteButton(messageId) {
  const deleteButton = document.getElementById('delete-message-btn');
  
  deleteButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete message');
        }
        return response.json();
      })
      .then(data => {
        // Redirect to messages list
        window.location.href = '/messages';
      })
      .catch(error => {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
      });
    }
  });
}
