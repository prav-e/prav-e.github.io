// generateSecretKey.js

const crypto = require('crypto');

// Function to generate a random string
const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate and print a random secret key
const secretKey = generateRandomString(32); // Adjust the length as needed
console.log('Generated Secret Key:', secretKey);
