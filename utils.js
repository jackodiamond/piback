// dynamoUtils.js

const express = require('express');
const router = express.Router();
const { docClient } = require('./index');

// DynamoDB table name
const usersTable = 'Users'; // Replace with your DynamoDB table name

// Update avatar URL API
router.put('/updateAvatarUrl', async (req, res) => {
  const { email, newAvatarUrl } = req.body;

  const params = {
    TableName: usersTable,
    Key: { email },
    UpdateExpression: 'SET avatarUrl = :newAvatarUrl',
    ExpressionAttributeValues: {
      ':newAvatarUrl': newAvatarUrl
    },
    ReturnValues: 'ALL_NEW' // Return updated item
  };

  try {
    const data = await docClient.update(params).promise();
    res.json({ success: true, message: 'Avatar URL updated successfully' });
  } catch (error) {
    console.error('Error updating avatar URL:', error);
    res.status(500).json({ success: false, message: 'Error updating avatar URL' });
  }
});

// Update tokens API
router.put('/updateTokens', async (req, res) => {
  const { email, tokensToAdd } = req.body;

  const params = {
    TableName: usersTable,
    Key: { email },
    UpdateExpression: 'SET tokens = tokens + :tokensToAdd',
    ExpressionAttributeValues: {
      ':tokensToAdd': tokensToAdd
    },
    ReturnValues: 'ALL_NEW' // Return updated item
  };

  try {
    const data = await docClient.update(params).promise();
    res.json({ success: true, message: 'Tokens updated successfully' });
  } catch (error) {
    console.error('Error updating tokens:', error);
    res.status(500).json({ success: false, message: 'Error updating tokens' });
  }
});

// Add asset API
router.put('/addAsset', async (req, res) => {
  const { email, newAsset } = req.body;

  const params = {
    TableName: usersTable,
    Key: { email },
    UpdateExpression: 'SET assets = list_append(assets, :newAsset)',
    ExpressionAttributeValues: {
      ':newAsset': [newAsset]
    },
    ReturnValues: 'ALL_NEW' // Return updated item
  };

  try {
    const data = await docClient.update(params).promise();
    res.json({ success: true, message: 'Asset added successfully' });
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ success: false, message: 'Error adding asset' });
  }
});

module.exports = router;
