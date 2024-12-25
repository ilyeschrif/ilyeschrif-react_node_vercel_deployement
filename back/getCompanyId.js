// getCompanyId.js
const mysql = require('mysql2/promise');

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TileCatalogDB',
};

async function getCompanyId(company_name) {
  const connection = await mysql.createConnection(dbConfig);
  const query = 'SELECT id FROM Company WHERE company_name = ?';
  const [rows] = await connection.execute(query, [company_name]);
  await connection.end();
  return rows;
}

module.exports = { getCompanyId };
