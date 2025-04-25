const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');  // إضافة مكتبة bcryptjs للتحقق من كلمة السر المشفرة
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const replyRoutes = require('./routes/replyRoutes');
const { initializeDatabase } = require('./config/db');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
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
app.use('/api', replyRoutes); // Added reply routes

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

// Login route (modified)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // البحث عن المستخدم في قاعدة البيانات
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Error checking user:', err.message);
      return res.status(500).send('Server Error');
    }

    if (!row) {
      return res.status(401).send('Invalid credentials');  // لو المستخدم مش موجود
    }

    // مقارنة كلمة السر المدخلة بالكلمة المخزنة في قاعدة البيانات
    const isMatch = bcrypt.compareSync(password, row.password);
    
    if (isMatch) {
      // كلمة السر صحيحة، قم بتسجيل الدخول
      res.send('Login successful');
    } else {
      // كلمة السر خاطئة
      res.status(401).send('Invalid credentials');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
