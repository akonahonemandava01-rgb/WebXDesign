const mysql = require("mysql2/promise");
require("dotenv").config();

// A pool (instead of a single connection) lets Express handle many
// concurrent requests from both the web app and the mobile app without
// queries blocking each other, and it auto-recovers dropped connections.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Quick sanity check on startup - doesn't block server start, just logs.
pool.getConnection()
    .then((connection) => {
        console.log("Connected to MySQL pool!");
        connection.release();
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

module.exports = pool;