const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'food_beverage_db',
    charset: 'utf8mb4',
    charsetNumber: 45, // UTF8MB4_GENERAL_CI
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection and charset on pool creation
(async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query("SET NAMES 'utf8mb4'");
        connection.release();
        console.log('Database pool created with UTF8MB4 charset');
    } catch (err) {
        console.error('Error setting up database charset:', err);
    }
})();

module.exports = pool;
