// auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { docClient } = require('./index');

// User data (in DynamoDB for now)
const usersTable = 'Users'; // Replace with your DynamoDB table name

// API to get list of all user emails
router.get('/emails', (req, res) => {
  const params = {
    TableName: usersTable,
    ProjectionExpression: 'email' // Projection expression to retrieve only email attribute
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.error('Unable to scan users table', err);
      return res.status(500).json({ success: false, message: 'Error retrieving user emails' });
    }
    
    // Extract emails from data.Items
    const emails = data.Items.map(item => item.email);
    res.json({ success: true, emails });
  });
});

// Login API
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Define DynamoDB params to get user by email
  const params = {
    TableName: usersTable,
    Key: { email }
  };

  // Get user from DynamoDB
  docClient.get(params, (err, data) => {
    if (err || !data.Item) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = data.Item;

    // Compare passwords
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      delete user.password;
      res.json({ success: true, message: 'Login successful', user });
    });
  });
});

// Signup API
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Encrypt password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error encrypting password' });
    }

    // Define DynamoDB params to put new user
    const params = {
      TableName: usersTable,
      Item: {
        username,
        email,
        password: hash,
        avatarUrl:"",
        tokens: 0,
        assets: []
      }
    };

    // Put new user into DynamoDB
    docClient.put(params, (err, data) => {
      if (err) {
        console.error('Unable to add user', err);
        res.status(500).json({ success: false, message: 'Error creating user' });
      } else {
        console.log('User created successfully', data);
        res.json({ success: true, message: 'Signup successful' });
      }
    });
  });
});

module.exports = router;
