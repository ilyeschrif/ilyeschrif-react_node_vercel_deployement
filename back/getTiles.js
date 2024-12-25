const mysql = require('mysql2/promise');

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TileCatalogDB',
};

async function getTiles(length_min, length_max, width_min, width_max) {
  const connection = await mysql.createConnection(dbConfig);

  const sql = `
    SELECT 
        t.id AS tile_id, t.name, t.color, t.type, c.company_name, s.size, 
        i.image_path
    FROM tile t
    JOIN tile_size ts ON t.id = ts.tile_id
    JOIN size s ON ts.size_id = s.id
    JOIN tile_company tc ON t.id = tc.tile_id
    JOIN company c ON tc.company_id = c.id
    LEFT JOIN tile_image ti ON t.id = ti.tile_id
    LEFT JOIN Image i ON ti.image_id = i.id
    WHERE 
        CAST(SUBSTRING_INDEX(s.size, 'x', 1) AS UNSIGNED) BETWEEN ? AND ? AND
        CAST(SUBSTRING_INDEX(s.size, 'x', -1) AS UNSIGNED) BETWEEN ? AND ?
  `;

  const [rows] = await connection.execute(sql, [length_min, length_max, width_min, width_max]);

  // Group tiles by tile_id
  const tiles = rows.reduce((acc, row) => {
    const tile_id = row.tile_id;

    if (!acc[tile_id]) {
      acc[tile_id] = {
        tile_id: tile_id,
        name: row.name,
        color: row.color,
        type: row.type,
        company_name: row.company_name,
        sizes: [],
        images: [],
      };
    }

    acc[tile_id].sizes.push(row.size);
    if (row.image_path) {
      acc[tile_id].images.push(row.image_path);
    }

    return acc;
  }, {});

  await connection.end();

  return Object.values(tiles); // Convert the object to an array of tiles
}

module.exports = { getTiles };
