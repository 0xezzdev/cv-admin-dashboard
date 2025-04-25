document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the messages list page
  if (window.location.pathname === '/messages') {
    loadAllMessages();
    setupMessageFilters();
  }
  
  // Check if we're on the message detail page
  if (window.location.pathname.startsWith('/message/')) {
    const messageId = window.location.pathname.split('/').pop();
    loadMessageDetails(messageId);
    setupReplyForm(messageId);
    setupDeleteButton(messageId);
  }
});

// Load all messages for the messages page
function loadAllMessages(filter = 'all') {
  const messagesList = document.getElementById('messages-list');
  messagesList.innerHTML = '<div class="loading">جارٍ تحميل الرسائل...</div>';

  fetch('/api/messages', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('فشل في تحميل الرسائل');
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
      messagesList.innerHTML = '<div class="no-messages">لا توجد رسائل حالياً</div>';
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
    messagesList.innerHTML = '<div class="error">حدث خطأ أثناء تحميل الرسائل</div>';
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
  const replies
