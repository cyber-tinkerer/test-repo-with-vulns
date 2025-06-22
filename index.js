const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// Vulnerable code examples
app.get('/', (req, res) => {
  // Using lodash with potential prototype pollution
  const userInput = req.query.data || '{}';
  const data = _.merge({}, JSON.parse(userInput)); // VULNERABLE: prototype pollution
  
  // Using moment with potential DoS
  const date = moment(req.query.date).format('YYYY-MM-DD'); // VULNERABLE: ReDoS
  
  res.json({
    message: 'Test app with vulnerabilities',
    data: data,
    date: date,
    version: '1.0.0'
  });
});

// Vulnerable API endpoint
app.get('/api/users', async (req, res) => {
  try {
    // Using axios with potential SSRF
    const response = await axios.get(req.query.url); // VULNERABLE: SSRF
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerable file upload (simulated)
app.post('/upload', express.json(), (req, res) => {
  const { filename, content } = req.body;
  
  // VULNERABLE: Path traversal
  const filePath = `/uploads/${filename}`;
  
  res.json({
    message: 'File uploaded',
    path: filePath
  });
});

app.listen(PORT, () => {
  console.log(`Test app running on port ${PORT}`);
  console.log('This app contains intentionally vulnerable dependencies for testing:');
  console.log('- lodash 4.17.15 (prototype pollution)');
  console.log('- axios 0.21.1 (SSRF)');
  console.log('- moment 2.29.1 (ReDoS)');
  console.log('- express 4.17.1 (various CVEs)');
  console.log('- jquery 3.6.0 (XSS)');
  console.log('- bootstrap 4.6.0 (XSS)');
  console.log('- react 16.14.0 (various CVEs)');
});

module.exports = app; 