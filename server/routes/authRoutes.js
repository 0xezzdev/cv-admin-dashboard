const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');
const router = express.Router();
const user = 'admin';

// تسجيل الدخول
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Please provide both username and password.' });
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      return res.status(500).send({ message: 'Error while checking username.' });
    }

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // التحقق من الباسورد باستخدام bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send({ message: 'Error while comparing password.' });
      }

      if (!isMatch) {
        return res.status(400).send({ message: 'Invalid password.' });
      }

      // تسجيل الدخول بنجاح
      res.status(200).send({ message: 'Login successful', user });
    });
  });
});

module.exports = router;
