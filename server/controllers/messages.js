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
