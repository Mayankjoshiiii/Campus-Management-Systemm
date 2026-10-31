const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.database_pass || 'mayank',
    database: process.env.DB_NAME || 'university',
    port: parseInt(process.env.DB_PORT) || 3306,
    multipleStatements: true
});

// Provide connect method for backward compatibility with app.js
pool.connect = function (callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            if (callback) callback(err);
            return;
        }
        connection.release();
        if (callback) callback(null);
    });
};

module.exports = pool;