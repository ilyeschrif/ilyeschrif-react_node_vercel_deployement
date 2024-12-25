// getCompanies.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'TileCatalogDB'
});

// الاتصال بقاعدة البيانات
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
});

// استرجاع الشركات
function getCompanies(callback) {
    const sql = "SELECT id, company_name FROM Company";
    db.query(sql, (err, results) => {
        callback(err, results);
    });
}

module.exports = { getCompanies };
