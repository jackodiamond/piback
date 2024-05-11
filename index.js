// index.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

// Middleware
app.use(bodyParser.json());

// Configure AWS SDK and DynamoDB document client
AWS.config.update({
  region: 'ap-south-1', // Replace with your DynamoDB region
  accessKeyId: '', // Replace with your AWS Access Key ID
  secretAccessKey: '' // Replace with your AWS Secret Access Key
});
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = { docClient };

// Routes
const authRoutes = require('./auth');
app.use('/auth', authRoutes);

const utilRoutes = require('./utils');
app.use('/util', utilRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


