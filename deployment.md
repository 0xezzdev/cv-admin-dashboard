# Admin Dashboard Deployment Instructions

This document outlines how to deploy the admin dashboard for Ezzeldeen Mohamed's CV website.

## Prerequisites
- Node.js and npm installed
- Access to the server where the CV website is hosted

## Deployment Steps

### 1. Install Dependencies
```bash
cd /home/ubuntu/cv_website_admin
npm install
```

### 2. Start the Admin Dashboard Server
```bash
cd /home/ubuntu/cv_website_admin
npm start
```

### 3. Configure the CV Website to Connect to Admin Dashboard
- Add the contact-form.js script to the CV website
- Update the contact form to send messages to the admin dashboard API

### 4. Access the Admin Dashboard
- The admin dashboard will be available at: http://your-server-address:3000
- Login with the default credentials:
  - Username: admin
  - Password: admin123

### 5. Security Recommendations
- Change the default admin password immediately after first login
- Set up HTTPS for secure communication
- Consider setting up a reverse proxy (like Nginx) for production use

## Admin Dashboard Features
- Secure login system
- Dashboard with message statistics
- Message management (view, reply, delete)
- Email notifications for new messages
- Reply system that sends emails to message senders

## Default Admin Credentials
- Username: admin
- Password: admin123
