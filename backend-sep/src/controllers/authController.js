const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

async function registerStudent(req, res) {
    const { email, password, student_no, gender, nationality, course_id } = req.body;

    if (!email || !password || !student_no || !gender || !nationality || !course_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            "SELECT user_id FROM USERS WHERE email = ?",
            [email]
        );
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(409).json({ error: "Email already registered" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [userResult] = await connection.query(
            "INSERT INTO USERS (email, password_hash, role, is_verified) VALUES (?, ?, 'student', FALSE)",
            [email, password_hash]
        );
        const user_id = userResult.insertId;

        await connection.query(
            `INSERT INTO STUDENTS (user_id, course_id, student_no, gender, nationality)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, course_id, student_no, gender, nationality]
        );

        await connection.commit();

        const token = generateToken({ user_id, role: "student" });
        res.status(201).json({ message: "Student registered", token });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    } finally {
        connection.release();
    }
}

async function registerEmployer(req, res) {
    const { email, password, company_name, registration_number } = req.body;

    if (!email || !password || !company_name || !registration_number) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            "SELECT user_id FROM USERS WHERE email = ?",
            [email]
        );
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(409).json({ error: "Email already registered" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [userResult] = await connection.query(
            "INSERT INTO USERS (email, password_hash, role, is_verified) VALUES (?, ?, 'employer', FALSE)",
            [email, password_hash]
        );
        const user_id = userResult.insertId;

        await connection.query(
            `INSERT INTO EMPLOYERS (user_id, company_name, registration_number, approval_status)
             VALUES (?, ?, ?, 'Pending')`,
            [user_id, company_name, registration_number]
        );

        await connection.commit();

        // No token yet - per the SEP spec, employers can't log in until Admin approves them.
        res.status(201).json({
            message: "Employer registered. Awaiting admin approval before you can log in."
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    } finally {
        connection.release();
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    try {
        const [rows] = await pool.query("SELECT * FROM USERS WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const user = rows[0];

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (user.role === "employer") {
            const [employerRows] = await pool.query(
                "SELECT approval_status FROM EMPLOYERS WHERE user_id = ?",
                [user.user_id]
            );
            if (employerRows.length === 0 || employerRows[0].approval_status !== "Approved") {
                return res.status(403).json({ error: "Employer account not yet approved" });
            }
        }

        const token = generateToken({ user_id: user.user_id, role: user.role });
        res.json({ message: "Login successful", token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
}

async function forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const [rows] = await pool.query("SELECT user_id FROM USERS WHERE email = ?", [email]);

        // Respond the same way whether or not the email exists, so we don't
        // leak which addresses are registered.
        if (rows.length === 0) {
            return res.json({ message: "If that email is registered, a reset link has been generated." });
        }

        const reset_token = crypto.randomBytes(32).toString("hex");
        const reset_expiry = new Date(Date.now() + 30 * 60 * 1000); // valid for 30 minutes

        await pool.query(
            "UPDATE USERS SET reset_token = ?, reset_expiry = ? WHERE user_id = ?",
            [reset_token, reset_expiry, rows[0].user_id]
        );

        // NOTE: per the spec (section 3.7), an email gateway is a dependency
        // that isn't wired up yet. Until it is, the token is returned directly
        // here so you can test the flow. Once you have an email service, swap
        // this response for an actual email containing a reset link, and stop
        // returning reset_token in the JSON.
        res.json({
            message: "If that email is registered, a reset link has been generated.",
            reset_token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process request" });
    }
}

async function resetPassword(req, res) {
    const { reset_token, new_password } = req.body;
    if (!reset_token || !new_password) {
        return res.status(400).json({ error: "reset_token and new_password are required" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT user_id, reset_expiry FROM USERS WHERE reset_token = ?",
            [reset_token]
        );
        if (rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        const { user_id, reset_expiry } = rows[0];
        if (!reset_expiry || new Date(reset_expiry) < new Date()) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        const password_hash = await bcrypt.hash(new_password, 10);
        await pool.query(
            "UPDATE USERS SET password_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE user_id = ?",
            [password_hash, user_id]
        );

        res.json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reset password" });
    }
}

module.exports = { registerStudent, registerEmployer, login, forgotPassword, resetPassword };