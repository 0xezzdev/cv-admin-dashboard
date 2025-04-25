// Database configuration
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = path.join(__dirname, '../../data/admin.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  // Create admin user table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    replied INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create replies table
  db.run(`CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages (id)
  )`);

  // Check if admin user exists, if not create default admin
  db.get(`SELECT * FROM users WHERE username = 'admin'`, [], (err, row) => {
    if (err) {
      console.error('Error checking admin user:', err.message);
      return;
    }
    
    if (!row) {
      const bcrypt = require('bcryptjs');
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('admin123', salt);
      
      db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, 
        ['admin', hashedPassword, 'ezzeldeen20052018@gmail.com'], 
        function(err) {
          if (err) {
            console.error('Error creating admin user:', err.message);
          } else {
            console.log('Default admin user created successfully.');
          }
        }
      );
    }
  });
};

module.exports = {
  db,
  initializeDatabase
};
