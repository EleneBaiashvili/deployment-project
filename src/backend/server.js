
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const dataPath = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(dataPath);
  } catch (error) {
    // File doesn't exist, create it with default data
    await fs.writeFile(dataPath, JSON.stringify({ data: "No data received yet" }));
  }
}

// API endpoint to receive data
app.post('/api/create-answer', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data field is required' });
    }
    
    // Store the data to a file
    await fs.writeFile(dataPath, JSON.stringify({ data }));
    
    console.log('Received new data:', data);
    res.status(200).json({ success: true, message: 'Data received and stored successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get the latest data
app.get('/api/answer', async (req, res) => {
  try {
    const fileData = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(fileData);
    
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize data file before starting server
initializeDataFile();

// Special handling for Lovable environment - set routes for the API
if (process.env.LOVABLE_ENV) {
  // API routes are already set up above
  console.log('Running in Lovable environment');
} else {
  // Serve static files for frontend when not in Lovable
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // Serve the frontend for any route not matching the API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
