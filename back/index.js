const express = require('express');
const { getCompanies } = require('./getCompanies');
const { getCompanyId } = require('./getCompanyId');
const { getTileTypes } = require('./getTileTypes');
const { getTiles } = require('./getTiles'); // Correct import for the getTiles function

const app = express();
const port = 2000;
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Route to get companies
app.get('/companies', (req, res) => {
    getCompanies((err, results) => {
        if (err) {
            console.error("Error fetching companies:", err);
            res.status(500).json({ error: "Error fetching companies" });
            return;
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.json({ message: "No companies found" });
        }
    });
});

// Route to get company ID based on company name
app.post('/get-company-id', async (req, res) => {
    try {
        const { company_name } = req.body;

        if (!company_name) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        const results = await getCompanyId(company_name);

        if (results.length > 0) {
            return res.json({ id: results[0].id });
        } else {
            return res.status(404).json({ error: 'Company not found' });
        }
    } catch (error) {
        console.error('Error processing the request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get tile types
app.get('/tile-types', async (req, res) => {
  try {
    const tileTypes = await getTileTypes();
    if (tileTypes.length > 0) {
      res.json(tileTypes);
    } else {
      res.json({ message: 'No types found' });
    }
  } catch (err) {
    console.error('Error fetching tile types:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch tiles by size
app.post('/fetch-tiles-by-size', async (req, res) => {
  const { length_min = 0, length_max = 300, width_min = 0, width_max = 300 } = req.body;

  try {
    const tiles = await getTiles(length_min, length_max, width_min, width_max); // Use getTiles function here
    res.json(tiles);
  } catch (err) {
    console.error('Error fetching tiles:', err);
    res.status(500).json({ error: 'Error fetching tiles' });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
