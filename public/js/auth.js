// Authentication JavaScript for admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the login page
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    setupLoginForm();
  }

  // Check if we're on any admin page with logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    checkAuthentication();
    setupLogout();
  }
});

// Setup login form functionality
function setupLoginForm() {
  const loginButton = document.getElementById('login-button');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  loginButton.addEventListener('click', function() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      errorMessage.textContent = 'Please enter both username and password';
      return;
    }

    // Clear previous error
    errorMessage.textContent = '';
    
    // Disable button during login attempt
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    // Send login request
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login successful') {
        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      } else {
        // Show error message
        errorMessage.textContent = data.message || 'Login failed';
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      errorMessage.textContent = 'An error occurred. Please try again.';
      loginButton.disabled = false;
      loginButton.textContent = 'Login';
    });
  });

  // Allow login on Enter key press
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      loginButton.click();
    }
  });
}

// Check if user is authenticated
function checkAuthentication() {
  fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      // If not authenticated, redirect to login
      window.location.href = '/';
      throw new Error('Not authenticated');
    }
    return response.json();
  })
  .then(data => {
    // Update username display if available
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay && data.user) {
      usernameDisplay.textContent = data.user.username;
    }
  })
  .catch(error => {
    console.error('Authentication check error:', error);
  });
}

// Setup logout functionality
function setupLogout() {
  const logoutButton = document.getElementById('logout-button');
  
  logoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(() => {
      // Redirect to login page
      window.location.href = '/';
    })
    .catch(error => {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    });
  });
}
