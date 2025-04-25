// Dashboard JavaScript for admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the dashboard page
  if (window.location.pathname === '/dashboard') {
    loadDashboardStats();
    loadRecentMessages();
  }
});

// Load dashboard statistics
function loadDashboardStats() {
  fetch('/api/messages/stats', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load stats');
    }
    return response.json();
  })
  .then(data => {
    // Update stats display
    document.getElementById('total-messages').textContent = data.total;
    document.getElementById('unread-messages').textContent = data.unread;
    document.getElementById('replied-messages').textContent = data.replied;
  })
  .catch(error => {
    console.error('Error loading stats:', error);
  });
}

// Load recent messages for dashboard
function loadRecentMessages() {
  const messagesList = document.getElementById('recent-messages-list');
  
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
    
    // Display only the 5 most recent messages
    const recentMessages = data.messages.slice(0, 5);
    
    if (recentMessages.length === 0) {
      messagesList.innerHTML = '<div class="no-messages">No messages yet</div>';
      return;
    }
    
    // Create message items
    recentMessages.forEach(message => {
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
