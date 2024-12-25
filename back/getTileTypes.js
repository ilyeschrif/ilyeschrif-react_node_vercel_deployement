// getTileTypes.js
const mysql = require('mysql2/promise');

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TileCatalogDB',
};

async function getTileTypes() {
  const connection = await mysql.createConnection(dbConfig);
  const query = 'SELECT DISTINCT type FROM Tile';
  const [rows] = await connection.execute(query);
  await connection.end();
  return rows.map(row => row.type); // Return an array of types
}

module.exports = { getTileTypes };
