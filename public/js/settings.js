// Settings JavaScript for admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the settings page
  if (window.location.pathname === '/settings') {
    setupPasswordChange();
    setupNotificationSettings();
  }
});

// Setup password change functionality
function setupPasswordChange() {
  const changePasswordBtn = document.getElementById('change-password-btn');
  const currentPassword = document.getElementById('current-password');
  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');
  const passwordStatus = document.getElementById('password-status');
  
  changePasswordBtn.addEventListener('click', function() {
    // Clear previous status
    passwordStatus.textContent = '';
    passwordStatus.className = 'status-message';
    
    // Validate inputs
    if (!currentPassword.value) {
      passwordStatus.textContent = 'Please enter your current password';
      passwordStatus.className = 'status-message error';
      return;
    }
    
    if (!newPassword.value) {
      passwordStatus.textContent = 'Please enter a new password';
      passwordStatus.className = 'status-message error';
      return;
    }
    
    if (newPassword.value !== confirmPassword.value) {
      passwordStatus.textContent = 'New passwords do not match';
      passwordStatus.className = 'status-message error';
      return;
    }
    
    // Disable button during submission
    changePasswordBtn.disabled = true;
    changePasswordBtn.textContent = 'Changing...';
    
    // Send password change request
    fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Password changed successfully') {
        // Show success message
        passwordStatus.textContent = 'Password changed successfully';
        passwordStatus.className = 'status-message success';
        
        // Clear form
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
      } else {
        // Show error message
        passwordStatus.textContent = data.message || 'Failed to change password';
        passwordStatus.className = 'status-message error';
      }
      
      // Reset button
      changePasswordBtn.disabled = false;
      changePasswordBtn.textContent = 'Change Password';
    })
    .catch(error => {
      console.error('Password change error:', error);
      passwordStatus.textContent = 'An error occurred. Please try again.';
      passwordStatus.className = 'status-message error';
      
      // Reset button
      changePasswordBtn.disabled = false;
      changePasswordBtn.textContent = 'Change Password';
    });
  });
}

// Setup notification settings
function setupNotificationSettings() {
  const saveNotificationBtn = document.getElementById('save-notification-settings-btn');
  const notifyNewMessages = document.getElementById('notify-new-messages');
  const notificationStatus = document.getElementById('notification-status');
  
  saveNotificationBtn.addEventListener('click', function() {
    // Show success message (in a real implementation, this would save to a database)
    notificationStatus.textContent = 'Notification settings saved successfully';
    notificationStatus.className = 'status-message success';
    
    // In a real implementation, we would save the settings to the server
    console.log('Notification settings:', {
      notifyNewMessages: notifyNewMessages.checked
    });
  });
}
