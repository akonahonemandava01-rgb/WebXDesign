const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");
const pool = require("../config/db");

async function getStudentId(user_id) {
    const [rows] = await pool.query("SELECT student_id FROM STUDENTS WHERE user_id = ?", [user_id]);
    return rows.length ? rows[0].student_id : null;
}

async function getEmployerId(user_id) {
    const [rows] = await pool.query("SELECT employer_id FROM EMPLOYERS WHERE user_id = ?", [user_id]);
    return rows.length ? rows[0].employer_id : null;
}

// Student applies to a job
async function applyToJob(req, res) {
    const { job_id } = req.body;
    if (!job_id) return res.status(400).json({ error: "job_id is required" });

    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [jobRows] = await pool.query(
            `SELECT job_id FROM JOBS
             WHERE job_id = ? AND approval_status = 'Approved' AND is_deleted = FALSE AND closing_date >= NOW()`,
            [job_id]
        );
        if (jobRows.length === 0) {
            return res.status(404).json({ error: "Job not available for applications" });
        }

        const [result] = await pool.query(
            "INSERT INTO APPLICATIONS (job_id, student_id, application_status) VALUES (?, ?, 'Pending')",
            [job_id, student_id]
        );

        res.status(201).json({ message: "Application submitted", application_id: result.insertId });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "You have already applied to this job" });
        }
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
    }
}

// Student's own application history
async function myApplications(req, res) {
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [rows] = await pool.query(
            `SELECT a.application_id, a.application_status, a.applied_at,
                    j.title, j.location, j.employment_type, j.hourly_rate
             FROM APPLICATIONS a
             JOIN JOBS j ON a.job_id = j.job_id
             WHERE a.student_id = ?
             ORDER BY a.applied_at DESC`,
            [student_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
}

// Student withdraws while still Pending
async function withdrawApplication(req, res) {
    const { id } = req.params;
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            `UPDATE APPLICATIONS
             SET application_status = 'Withdrawn'
             WHERE application_id = ? AND student_id = ? AND application_status = 'Pending'`,
            [id, student_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Application not found, not yours, or no longer pending" });
        }

        res.json({ message: "Application withdrawn" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to withdraw application" });
    }
}

// Employer views applicants for one of their own jobs
async function jobApplicants(req, res) {
    const { jobId } = req.params;
    try {
        const employer_id = await getEmployerId(req.user.user_id);
        if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

        const [jobRows] = await pool.query(
            "SELECT job_id FROM JOBS WHERE job_id = ? AND employer_id = ?",
            [jobId, employer_id]
        );
        if (jobRows.length === 0) {
            return res.status(404).json({ error: "Job not found or not owned by this employer" });
        }

        const [rows] = await pool.query(
            `SELECT a.application_id, a.application_status, a.applied_at,
                    s.student_id, s.student_no, s.gender, s.nationality,
                    u.email
             FROM APPLICATIONS a
             JOIN STUDENTS s ON a.student_id = s.student_id
             JOIN USERS u ON s.user_id = u.user_id
             WHERE a.job_id = ? AND a.application_status != 'Withdrawn'
             ORDER BY a.applied_at ASC`,
            [jobId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch applicants" });
    }
}

// Employer marks an applicant Successful / Unsuccessful
async function updateApplicationStatus(req, res) {
    const { id } = req.params;
    const { application_status } = req.body;

    if (!["Successful", "Unsuccessful"].includes(application_status)) {
        return res.status(400).json({ error: "Status must be Successful or Unsuccessful" });
    }

    try {
        const employer_id = await getEmployerId(req.user.user_id);
        if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

        const [existing] = await pool.query(
            `SELECT a.application_status FROM APPLICATIONS a
             JOIN JOBS j ON a.job_id = j.job_id
             WHERE a.application_id = ? AND j.employer_id = ?`,
            [id, employer_id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: "Application not found or not owned by this employer" });
        }
        if (existing[0].application_status !== "Pending") {
            return res.status(409).json({
                error: `This application was already marked ${existing[0].application_status} and cannot be changed again`
            });
        }

        await pool.query(
            `UPDATE APPLICATIONS a
             JOIN JOBS j ON a.job_id = j.job_id
             SET a.application_status = ?
             WHERE a.application_id = ? AND j.employer_id = ?`,
            [application_status, id, employer_id]
        );

        res.json({ message: `Application marked as ${application_status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update application" });
    }
}

// ---- Application documents ----
// A student may only add/remove documents while their application is still
// Pending (matches spec 3.11.3: "the student will no longer be able to
// delete or submit additional documentation" after applying/deciding is done).

async function uploadDocument(req, res) {
    const { id } = req.params; // application_id
    const { description } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [appRows] = await pool.query(
            "SELECT application_status FROM APPLICATIONS WHERE application_id = ? AND student_id = ?",
            [id, student_id]
        );
        if (appRows.length === 0) {
            return res.status(404).json({ error: "Application not found or not yours" });
        }
        if (appRows[0].application_status !== "Pending") {
            return res.status(409).json({ error: "Documents can only be added while the application is Pending" });
        }

        const [result] = await pool.query(
            "INSERT INTO APPLICATION_DOCUMENTS (application_id, description, storage_path) VALUES (?, ?, ?)",
            [id, description || req.file.originalname, req.file.filename]
        );

        res.status(201).json({
            message: "Document uploaded",
            document_id: result.insertId,
            description: description || req.file.originalname
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to upload document" });
    }
}

async function listDocuments(req, res) {
    const { id } = req.params;
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [appRows] = await pool.query(
            "SELECT application_id FROM APPLICATIONS WHERE application_id = ? AND student_id = ?",
            [id, student_id]
        );
        if (appRows.length === 0) {
            return res.status(404).json({ error: "Application not found or not yours" });
        }

        const [docs] = await pool.query(
            "SELECT document_id, description, uploaded_at FROM APPLICATION_DOCUMENTS WHERE application_id = ?",
            [id]
        );
        res.json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
}

async function deleteDocument(req, res) {
    const { id, documentId } = req.params;
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [rows] = await pool.query(
            `SELECT d.document_id, d.storage_path, a.application_status
             FROM APPLICATION_DOCUMENTS d
             JOIN APPLICATIONS a ON d.application_id = a.application_id
             WHERE d.document_id = ? AND d.application_id = ? AND a.student_id = ?`,
            [documentId, id, student_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Document not found or not yours" });
        }
        if (rows[0].application_status !== "Pending") {
            return res.status(409).json({ error: "Documents can only be removed while the application is Pending" });
        }

        await pool.query("DELETE FROM APPLICATION_DOCUMENTS WHERE document_id = ?", [documentId]);

        const filePath = path.join(__dirname, "..", "..", "uploads", rows[0].storage_path);
        fs.unlink(filePath, () => {}); // best-effort cleanup, ignore errors if already gone

        res.json({ message: "Document deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete document" });
    }
}

// Both the owning student AND the owning employer (via the job) may download.
async function downloadDocument(req, res) {
    const { id, documentId } = req.params;
    try {
        let rows;
        if (req.user.role === "student") {
            const student_id = await getStudentId(req.user.user_id);
            if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

            [rows] = await pool.query(
                `SELECT d.storage_path, d.description FROM APPLICATION_DOCUMENTS d
                 JOIN APPLICATIONS a ON d.application_id = a.application_id
                 WHERE d.document_id = ? AND d.application_id = ? AND a.student_id = ?`,
                [documentId, id, student_id]
            );
        } else {
            const employer_id = await getEmployerId(req.user.user_id);
            if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

            [rows] = await pool.query(
                `SELECT d.storage_path, d.description FROM APPLICATION_DOCUMENTS d
                 JOIN APPLICATIONS a ON d.application_id = a.application_id
                 JOIN JOBS j ON a.job_id = j.job_id
                 WHERE d.document_id = ? AND d.application_id = ? AND j.employer_id = ?`,
                [documentId, id, employer_id]
            );
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Document not found or access denied" });
        }

        const filePath = path.join(__dirname, "..", "..", "uploads", rows[0].storage_path);
        res.download(filePath, rows[0].description || rows[0].storage_path);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to download document" });
    }
}

// Excel export for an employer's own job - excludes Withdrawn applicants,
// per spec 3.9.5.
async function exportApplicants(req, res) {
    const { jobId } = req.params;
    try {
        const employer_id = await getEmployerId(req.user.user_id);
        if (!employer_id) return res.status(403).json({ error: "No employer profile found for this account" });

        const [jobRows] = await pool.query(
            "SELECT job_id, title FROM JOBS WHERE job_id = ? AND employer_id = ?",
            [jobId, employer_id]
        );
        if (jobRows.length === 0) {
            return res.status(404).json({ error: "Job not found or not owned by this employer" });
        }

        const [applicants] = await pool.query(
            `SELECT a.application_id, a.application_status, a.applied_at,
                    s.student_no, s.full_name, s.gender, s.nationality, s.level,
                    u.email, s.cel, s.career_objective
             FROM APPLICATIONS a
             JOIN STUDENTS s ON a.student_id = s.student_id
             JOIN USERS u ON s.user_id = u.user_id
             WHERE a.job_id = ? AND a.application_status != 'Withdrawn'
             ORDER BY a.applied_at ASC`,
            [jobId]
        );

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Applicants");

        sheet.columns = [
            { header: "Application ID", key: "application_id", width: 15 },
            { header: "Status", key: "application_status", width: 15 },
            { header: "Applied At", key: "applied_at", width: 20 },
            { header: "Student No", key: "student_no", width: 15 },
            { header: "Full Name", key: "full_name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Cell", key: "cel", width: 15 },
            { header: "Gender", key: "gender", width: 10 },
            { header: "Nationality", key: "nationality", width: 15 },
            { header: "Level", key: "level", width: 15 },
            { header: "Career Objective", key: "career_objective", width: 40 }
        ];

        applicants.forEach((row) => sheet.addRow(row));

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="applicants_job_${jobId}.xlsx"`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to export applicants" });
    }
}

module.exports = {
    applyToJob,
    myApplications,
    withdrawApplication,
    jobApplicants,
    updateApplicationStatus,
    uploadDocument,
    listDocuments,
    deleteDocument,
    downloadDocument,
    exportApplicants
};