const pool = require("../config/db");

async function listEmployers(req, res) {
    const { status } = req.query;
    try {
        // Include approval metadata and approver email (if available)
        let query = `SELECT e.employer_id, e.company_name, e.registration_number, e.approval_status,
                            e.approved_by_user_id, e.approved_at, e.approval_comments, e.created_at,
                            u.email AS approved_by_email
                     FROM EMPLOYERS e
                     LEFT JOIN USERS u ON e.approved_by_user_id = u.user_id`;
        const params = [];
        if (status) {
            query += " WHERE e.approval_status = ?";
            params.push(status);
        }
        query += " ORDER BY e.created_at DESC";

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch employers" });
    }
}

async function reviewEmployer(req, res) {
    const { id } = req.params;
    const { approval_status, approval_comments } = req.body;

    if (!["Approved", "Rejected", "Deactivated"].includes(approval_status)) {
        return res.status(400).json({ error: "Status must be Approved, Rejected, or Deactivated" });
    }

    try {
        const [existing] = await pool.query(
            "SELECT approval_status FROM EMPLOYERS WHERE employer_id = ?",
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: "Employer not found" });
        }

        const currentStatus = existing[0].approval_status;
        if (approval_status === "Approved") {
            if (!["Pending", "Deactivated"].includes(currentStatus)) {
                return res.status(409).json({
                    error: `This employer is already ${currentStatus.toLowerCase()} and cannot be approved again`
                });
            }
        } else if (approval_status === "Rejected") {
            if (currentStatus !== "Pending") {
                return res.status(409).json({
                    error: `This employer is already ${currentStatus.toLowerCase()} and cannot be rejected`
                });
            }
        } else if (approval_status === "Deactivated") {
            if (currentStatus !== "Approved") {
                return res.status(409).json({
                    error: `Only approved employers can be deactivated`
                });
            }
        }

        await pool.query(
            `UPDATE EMPLOYERS
             SET approval_status = ?, approval_comments = ?, approved_by_user_id = ?, approved_at = NOW()
             WHERE employer_id = ?`,
            [approval_status, approval_comments || null, req.user.user_id, id]
        );
        res.json({ message: `Employer ${approval_status.toLowerCase()}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to review employer" });
    }
}

async function listJobsForReview(req, res) {
    const { status } = req.query;
    try {
        let query = `SELECT job_id, title, location, employment_type, closing_date, approval_status, created_at
                      FROM JOBS WHERE is_deleted = FALSE`;
        const params = [];
        if (status) {
            query += " AND approval_status = ?";
            params.push(status);
        }
        query += " ORDER BY created_at DESC";

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
}

async function reviewJob(req, res) {
    const { id } = req.params;
    const { approval_status, approval_comments } = req.body;

    if (!["Approved", "Rejected", "Queried"].includes(approval_status)) {
        return res.status(400).json({ error: "Status must be Approved, Rejected or Queried" });
    }

    try {
        const [existing] = await pool.query(
            "SELECT approval_status FROM JOBS WHERE job_id = ? AND is_deleted = FALSE",
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }
        // Pending/Queried are the only states an admin can still act on.
        // Approved/Rejected are final; Closed/Withdrawn are employer-driven states.
        if (!["Pending", "Queried"].includes(existing[0].approval_status)) {
            return res.status(409).json({
                error: `This job is already ${existing[0].approval_status.toLowerCase()} and cannot be reviewed again`
            });
        }

        await pool.query(
            `UPDATE JOBS
             SET approval_status = ?, approval_comments = ?, approved_by_user_id = ?, approved_at = NOW()
             WHERE job_id = ?`,
            [approval_status, approval_comments || null, req.user.user_id, id]
        );
        res.json({ message: `Job ${approval_status.toLowerCase()}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to review job" });
    }
}

async function getStats(req, res) {
    const { start_date, end_date } = req.query;
    const hasRange = Boolean(start_date && end_date);
    const rangeParams = hasRange ? [start_date, end_date] : [];

    try {
        const [[studentCountRow]] = await pool.query(
            `SELECT COUNT(*) AS total_students FROM STUDENTS
             ${hasRange ? "WHERE created_at BETWEEN ? AND ?" : ""}`,
            rangeParams
        );

        const [[employerCountRow]] = await pool.query(
            `SELECT COUNT(*) AS total_employers FROM EMPLOYERS
             ${hasRange ? "WHERE created_at BETWEEN ? AND ?" : ""}`,
            rangeParams
        );

        const [jobsByStatus] = await pool.query(
            `SELECT approval_status, COUNT(*) AS count FROM JOBS
             WHERE is_deleted = FALSE ${hasRange ? "AND created_at BETWEEN ? AND ?" : ""}
             GROUP BY approval_status`,
            rangeParams
        );

        const [applicationsByStatus] = await pool.query(
            `SELECT application_status, COUNT(*) AS count FROM APPLICATIONS
             ${hasRange ? "WHERE applied_at BETWEEN ? AND ?" : ""}
             GROUP BY application_status`,
            rangeParams
        );

        res.json({
            date_range: hasRange ? { start_date, end_date } : "all-time",
            total_students: studentCountRow.total_students,
            total_employers: employerCountRow.total_employers,
            jobs_by_status: jobsByStatus,
            applications_by_status: applicationsByStatus
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
}

// ---- Student placements for admin
async function listPlacements(req, res) {
    try {
        const query = `SELECT ap.application_id, s.student_no, s.full_name,
                              f.name AS faculty, s.level, c.name AS course,
                              e.company_name AS company, j.title AS position,
                              ap.applied_at, ap.application_status
                       FROM APPLICATIONS ap
                       JOIN STUDENTS s ON ap.student_id = s.student_id
                       LEFT JOIN COURSE c ON s.course_id = c.course_id
                       LEFT JOIN DEPARTMENT d ON c.department_id = d.department_id
                       LEFT JOIN FACULTY f ON d.faculty_id = f.faculty_id
                       LEFT JOIN JOBS j ON ap.job_id = j.job_id
                       LEFT JOIN EMPLOYERS e ON j.employer_id = e.employer_id
                       ORDER BY ap.applied_at DESC`;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch placements" });
    }
}

async function getEmployerDetails(req, res) {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT e.*, u.email AS owner_email
             FROM EMPLOYERS e
             LEFT JOIN USERS u ON e.user_id = u.user_id
             WHERE e.employer_id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Employer not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch employer details' });
    }
}

async function getJobDetails(req, res) {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT j.*, e.company_name, e.registration_number
             FROM JOBS j
             LEFT JOIN EMPLOYERS e ON j.employer_id = e.employer_id
             WHERE j.job_id = ? AND j.is_deleted = FALSE`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Job not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch job details' });
    }
}

module.exports = { listEmployers, reviewEmployer, listJobsForReview, reviewJob, getStats, listPlacements };
