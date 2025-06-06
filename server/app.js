// Updated app.js with proper CORS configuration
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const replyRoutes = require('./routes/replyRoutes');
const { initializeDatabase } = require('./config/db');

// Initialize express app
const app = express();

// CORS configuration - updated to allow requests from Netlify
const corsOptions = {
  origin: ['https://ezzeldeenmohamed-cv.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', replyRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/messages.html'));
});

app.get('/message/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/message-detail.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/settings.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
