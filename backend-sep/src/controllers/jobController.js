const pool = require("../config/db");

async function getEmployerId(user_id) {
    const [rows] = await pool.query("SELECT employer_id FROM EMPLOYERS WHERE user_id = ?", [user_id]);
    return rows.length ? rows[0].employer_id : null;
}

// ---- Public: the job board anyone can browse (students, employers, visitors) ----

async function listJobs(req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT job_id, title, location, employment_type, hourly_rate, closing_date
             FROM JOBS
             WHERE approval_status = 'Approved' AND is_deleted = FALSE AND closing_date >= NOW()
             ORDER BY created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
}

async function getJob(req, res) {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT * FROM JOBS WHERE job_id = ? AND approval_status = 'Approved' AND is_deleted = FALSE",
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: "Job not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch job" });
    }
}

// ---- Student: jobs matched to their own profile (spec 3.11.3) ----
// Filters the public board down to jobs whose "Limited to" restrictions
// (faculty, department, year of study, citizenship) the student satisfies.

async function listMatchedJobs(req, res) {
    try {
        const [studentRows] = await pool.query(
            `SELECT s.level, s.nationality, c.department_id, d.faculty_id
             FROM STUDENTS s
             JOIN COURSE c ON s.course_id = c.course_id
             JOIN DEPARTMENT d ON c.department_id = d.department_id
             WHERE s.user_id = ?`,
            [req.user.user_id]
        );
        if (studentRows.length === 0) {
            return res.status(403).json({ error: "No student profile found for this account" });
        }
        const { level, nationality, department_id, faculty_id } = studentRows[0];

        const [rows] = await pool.query(
            `SELECT job_id, title, location, employment_type, hourly_rate, closing_date
             FROM JOBS
             WHERE approval_status = 'Approved' AND is_deleted = FALSE AND closing_date >= NOW()
               AND (limited_faculty_id IS NULL OR limited_faculty_id = ?)
               AND (limited_department_id IS NULL OR limited_department_id = ?)
               AND (eligible_levels IS NULL OR JSON_CONTAINS(eligible_levels, JSON_QUOTE(?)))
               AND (citizenship_requirement = 'Open' OR ? = 'South Africa')
             ORDER BY created_at DESC`,
            [faculty_id, department_id, level || "", nationality]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch matched jobs" });
    }
}

// ---- Employer: manage own postings only (spec 3.9.2 "Manage Posts") ----
// An employer never sees other employers' jobs here - that's what the
// public /jobs board (above) is for. This is their private management list.

async function listMyJobs(req, res) {
    try {
        const employer_id = await getEmployerId(req.user.user_id);
        if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

        const [rows] = await pool.query(
            `SELECT job_id, title, location, employment_type, closing_date, approval_status, created_at
             FROM JOBS WHERE employer_id = ? AND is_deleted = FALSE
             ORDER BY created_at DESC`,
            [employer_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch your jobs" });
    }
}

async function getMyJob(req, res) {
    const { id } = req.params;
    try {
        const employer_id = await getEmployerId(req.user.user_id);
        if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

        const [rows] = await pool.query(
            "SELECT * FROM JOBS WHERE job_id = ? AND employer_id = ? AND is_deleted = FALSE",
            [id, employer_id]
        );
        if (rows.length === 0) return res.status(404).json({ error: "Job not found or not owned by this employer" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch job" });
    }
}

async function createJob(req, res) {
    const {
        title, description, location, employment_type, hourly_rate, closing_date,
        limited_faculty_id, limited_department_id, eligible_levels, citizenship_requirement
    } = req.body;

    if (!title || !description || !location || !employment_type || !closing_date) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (citizenship_requirement && !["Open", "SA_Only"].includes(citizenship_requirement)) {
        return res.status(400).json({ error: "citizenship_requirement must be 'Open' or 'SA_Only'" });
    }

    try {
        const employer_id = await getEmployerId(req.user.user_id);
        if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

        const [result] = await pool.query(
            `INSERT INTO JOBS
                (employer_id, title, description, location, employment_type, hourly_rate, closing_date,
                 approval_status, limited_faculty_id, limited_department_id, eligible_levels, citizenship_requirement)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)`,
            [
                employer_id, title, description, location, employment_type, hourly_rate || null, closing_date,
                limited_faculty_id || null,
                limited_department_id || null,
                eligible_levels ? JSON.stringify(eligible_levels) : null,
                citizenship_requirement || "Open"
            ]
        );

        res.status(201).json({ message: "Job created, pending admin approval", job_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create job" });
    }
}

// Employer edits their own job's content. Only allowed while Pending or
// Queried - if it was Queried (Admin asked for changes), a successful edit
// automatically resubmits it as Pending for re-review.
async function updateJob(req, res) {
    const { id } = req.params;
    const allowedFields = [
        "title", "description", "location", "employment_type", "hourly_rate", "closing_date",
        "limited_faculty_id", "limited_department_id", "eligible_levels", "citizenship_requirement"
    ];

    const updates = {};
    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = (field === "eligible_levels" && req.body[field] !== null)
                ? JSON.stringify(req.body[field])
                : req.body[field];
        }
    }
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No valid fields provided" });
    }

    try {
        const employer_id = await getEmployerId(req.user.user_id);
        if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

        const [jobRows] = await pool.query(
            "SELECT approval_status FROM JOBS WHERE job_id = ? AND employer_id = ? AND is_deleted = FALSE",
            [id, employer_id]
        );
        if (jobRows.length === 0) {
            return res.status(404).json({ error: "Job not found or not owned by this employer" });
        }
        if (!["Pending", "Queried"].includes(jobRows[0].approval_status)) {
            return res.status(409).json({
                error: `Jobs can only be edited while Pending or Queried (current status: ${jobRows[0].approval_status})`
            });
        }

        const wasQueried = jobRows[0].approval_status === "Queried";
        const setClause = Object.keys(updates).map((f) => `${f} = ?`).join(", ");
        const values = Object.values(updates);

        let query = `UPDATE JOBS SET ${setClause}`;
        if (wasQueried) {
            query += ", approval_status = 'Pending', approval_comments = NULL";
        }
        query += " WHERE job_id = ? AND employer_id = ?";

        await pool.query(query, [...values, id, employer_id]);

        res.json({
            message: wasQueried ? "Job updated and resubmitted for admin review" : "Job updated"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update job" });
    }
}

// Employer closes or withdraws their OWN job. Withdrawing cancels any
// still-Pending applications for it (spec 3.11.4: "Cancelled - set by the
// system when a post was withdrawn by Employer").
async function updateJobStatus(req, res) {
    const { id } = req.params;
    const { approval_status } = req.body;

    if (!["Closed", "Withdrawn"].includes(approval_status)) {
        return res.status(400).json({ error: "Employers may only set status to Closed or Withdrawn" });
    }

    const employer_id = await getEmployerId(req.user.user_id);
    if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            "UPDATE JOBS SET approval_status = ? WHERE job_id = ? AND employer_id = ?",
            [approval_status, id, employer_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Job not found or not owned by this employer" });
        }

        let cancelledCount = 0;
        if (approval_status === "Withdrawn") {
            const [cancelResult] = await connection.query(
                "UPDATE APPLICATIONS SET application_status = 'Cancelled' WHERE job_id = ? AND application_status = 'Pending'",
                [id]
            );
            cancelledCount = cancelResult.affectedRows;
        }

        await connection.commit();
        res.json({
            message: `Job status updated to ${approval_status}`,
            applications_cancelled: cancelledCount
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: "Failed to update job" });
    } finally {
        connection.release();
    }
}

module.exports = {
    listJobs, getJob, listMatchedJobs,
    listMyJobs, getMyJob,
    createJob, updateJob, updateJobStatus
};