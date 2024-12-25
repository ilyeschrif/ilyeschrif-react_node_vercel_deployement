const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TileCatalogDB',
};

// API endpoint to fetch tiles by color and company
router.post('/', async (req, res) => {
  const { color, company_id } = req.body;

  if (!color || !company_id) {
    return res.status(400).json({ error: 'Color and Company ID are required' });
  }

  try {
    // Create a database connection
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      SELECT 
        Tile.id AS tile_id, Tile.name, Tile.color, Tile.type, 
        Company.company_name,
        Size.size AS size,
        Image.image_path AS image
      FROM Tile
      INNER JOIN Tile_Company ON Tile.id = Tile_Company.tile_id
      INNER JOIN Company ON Tile_Company.company_id = Company.id
      LEFT JOIN Tile_Size ON Tile.id = Tile_Size.tile_id
      LEFT JOIN Size ON Tile_Size.size_id = Size.id
      LEFT JOIN Tile_Image ON Tile.id = Tile_Image.tile_id
      LEFT JOIN Image ON Tile_Image.image_id = Image.id
      WHERE Tile.color = ? AND Company.id = ?
    `;
    
    const [rows] = await connection.execute(sql, [color, company_id]);

    // Process the result into a structured format
    const tiles = [];
    rows.forEach(row => {
      const tileIndex = tiles.findIndex(tile => tile.tile_id === row.tile_id);
      if (tileIndex === -1) {
        // Add new tile if not already added
        tiles.push({
          tile_id: row.tile_id,
          name: row.name,
          color: row.color,
          type: row.type,
          company_name: row.company_name,
          sizes: row.size ? [row.size] : [],
          images: row.image ? [row.image] : [],
        });
      } else {
        // Update sizes and images arrays if tile already exists
        if (row.size && !tiles[tileIndex].sizes.includes(row.size)) {
          tiles[tileIndex].sizes.push(row.size);
        }
        if (row.image && !tiles[tileIndex].images.includes(row.image)) {
          tiles[tileIndex].images.push(row.image);
        }
      }
    });

    // Respond with the tiles data
    if (tiles.length > 0) {
      res.json(tiles);
    } else {
      res.json({ message: 'No tiles found' });
    }

    await connection.end();
  } catch (error) {
    console.error('Error fetching tiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
