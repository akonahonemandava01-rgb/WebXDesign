// One-off script to create an admin account.
// Run once with: node scripts/createAdmin.js
// Change the email/password below first, then delete or rename this file
// afterwards so it isn't left lying around in a real deployment.

require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../src/config/db");

const ADMIN_EMAIL = "admin@sep.local";
const ADMIN_PASSWORD = "adminPassword123";

async function createAdmin() {
    try {
        const [existing] = await pool.query("SELECT user_id FROM USERS WHERE email = ?", [ADMIN_EMAIL]);
        if (existing.length > 0) {
            console.log("An account with that email already exists. Nothing to do.");
            process.exit(0);
        }

        const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const [result] = await pool.query(
            "INSERT INTO USERS (email, password_hash, role, is_verified) VALUES (?, ?, 'admin', TRUE)",
            [ADMIN_EMAIL, password_hash]
        );

        console.log(`Admin created: user_id=${result.insertId}, email=${ADMIN_EMAIL}`);
        console.log("You can now log in with POST /api/auth/login using this email and password.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to create admin:", err);
        process.exit(1);
    }
}

createAdmin();