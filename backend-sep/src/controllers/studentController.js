const pool = require("../config/db");

async function getStudentId(user_id) {
    const [rows] = await pool.query("SELECT student_id FROM STUDENTS WHERE user_id = ?", [user_id]);
    return rows.length ? rows[0].student_id : null;
}

// ---- Profile (personal fields on STUDENTS) ----

async function getProfile(req, res) {
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [[profile]] = await pool.query(
            "SELECT s.*, u.email FROM STUDENTS s JOIN USERS u ON s.user_id = u.user_id WHERE s.student_id = ?",
            [student_id]
        );
        const [education] = await pool.query(
            "SELECT * FROM STUDENT_EDUCATION WHERE student_id = ? ORDER BY education_id DESC",
            [student_id]
        );
        const [employment] = await pool.query(
            "SELECT * FROM STUDENT_EMPLOYMENT WHERE student_id = ? ORDER BY employment_id DESC",
            [student_id]
        );
        const [referees] = await pool.query(
            "SELECT * FROM STUDENT_REFEREES WHERE student_id = ? ORDER BY referee_id DESC",
            [student_id]
        );
        const [skills] = await pool.query(
            `SELECT sk.skill_id, sk.name FROM STUDENT_SKILLS ss
             JOIN SKILLS sk ON ss.skill_id = sk.skill_id
             WHERE ss.student_id = ?`,
            [student_id]
        );

        res.json({ ...profile, education, employment, referees, skills });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
}

async function updateProfile(req, res) {
    const allowedFields = [
        "full_name", "address", "tel", "cel", "id_passport_no", "drivers_license",
        "career_objective", "race", "level", "achievements", "interests"
    ];

    const updates = {};
    for (const field of allowedFields) {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No valid fields provided" });
    }

    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const setClause = Object.keys(updates).map((f) => `${f} = ?`).join(", ");
        await pool.query(
            `UPDATE STUDENTS SET ${setClause} WHERE student_id = ?`,
            [...Object.values(updates), student_id]
        );
        res.json({ message: "Profile updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
}

// ---- Education ----

async function addEducation(req, res) {
    const { institution, date_range, qualification, subjects, majors, sub_majors, research } = req.body;
    if (!institution || !date_range || !qualification) {
        return res.status(400).json({ error: "institution, date_range and qualification are required" });
    }
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            `INSERT INTO STUDENT_EDUCATION
                (student_id, institution, date_range, qualification, subjects, majors, sub_majors, research)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [student_id, institution, date_range, qualification,
                subjects || null, majors || null, sub_majors || null, research || null]
        );
        res.status(201).json({ message: "Education added", education_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add education" });
    }
}

async function updateEducation(req, res) {
    const { id } = req.params;
    const fields = ["institution", "date_range", "qualification", "subjects", "majors", "sub_majors", "research"];
    const updates = {};
    for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No valid fields provided" });

    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const setClause = Object.keys(updates).map((f) => `${f} = ?`).join(", ");
        const [result] = await pool.query(
            `UPDATE STUDENT_EDUCATION SET ${setClause} WHERE education_id = ? AND student_id = ?`,
            [...Object.values(updates), id, student_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Education entry not found or not yours" });
        res.json({ message: "Education updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update education" });
    }
}

async function deleteEducation(req, res) {
    const { id } = req.params;
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            "DELETE FROM STUDENT_EDUCATION WHERE education_id = ? AND student_id = ?",
            [id, student_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Education entry not found or not yours" });
        res.json({ message: "Education deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete education" });
    }
}

// ---- Employment ----

async function addEmployment(req, res) {
    const { employer_name, date_range, job_title, tasks_responsibilities } = req.body;
    if (!employer_name || !date_range || !job_title) {
        return res.status(400).json({ error: "employer_name, date_range and job_title are required" });
    }
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            `INSERT INTO STUDENT_EMPLOYMENT (student_id, employer_name, date_range, job_title, tasks_responsibilities)
             VALUES (?, ?, ?, ?, ?)`,
            [student_id, employer_name, date_range, job_title, tasks_responsibilities || null]
        );
        res.status(201).json({ message: "Employment added", employment_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add employment" });
    }
}

async function updateEmployment(req, res) {
    const { id } = req.params;
    const fields = ["employer_name", "date_range", "job_title", "tasks_responsibilities"];
    const updates = {};
    for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No valid fields provided" });

    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const setClause = Object.keys(updates).map((f) => `${f} = ?`).join(", ");
        const [result] = await pool.query(
            `UPDATE STUDENT_EMPLOYMENT SET ${setClause} WHERE employment_id = ? AND student_id = ?`,
            [...Object.values(updates), id, student_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Employment entry not found or not yours" });
        res.json({ message: "Employment updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update employment" });
    }
}

async function deleteEmployment(req, res) {
    const { id } = req.params;
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            "DELETE FROM STUDENT_EMPLOYMENT WHERE employment_id = ? AND student_id = ?",
            [id, student_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Employment entry not found or not yours" });
        res.json({ message: "Employment deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete employment" });
    }
}

// ---- Referees ----

async function addReferee(req, res) {
    const { name, job_title, institution, cel, email } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            `INSERT INTO STUDENT_REFEREES (student_id, name, job_title, institution, cel, email)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [student_id, name, job_title || null, institution || null, cel || null, email || null]
        );
        res.status(201).json({ message: "Referee added", referee_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add referee" });
    }
}

async function updateReferee(req, res) {
    const { id } = req.params;
    const fields = ["name", "job_title", "institution", "cel", "email"];
    const updates = {};
    for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No valid fields provided" });

    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const setClause = Object.keys(updates).map((f) => `${f} = ?`).join(", ");
        const [result] = await pool.query(
            `UPDATE STUDENT_REFEREES SET ${setClause} WHERE referee_id = ? AND student_id = ?`,
            [...Object.values(updates), id, student_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Referee not found or not yours" });
        res.json({ message: "Referee updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update referee" });
    }
}

async function deleteReferee(req, res) {
    const { id } = req.params;
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            "DELETE FROM STUDENT_REFEREES WHERE referee_id = ? AND student_id = ?",
            [id, student_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Referee not found or not yours" });
        res.json({ message: "Referee deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete referee" });
    }
}

// ---- Skills (reuses your existing SKILLS / STUDENT_SKILLS junction) ----

async function addSkill(req, res) {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    const connection = await pool.getConnection();
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) {
            connection.release();
            return res.status(403).json({ error: "No student profile found for this account" });
        }

        await connection.beginTransaction();

        const [skillRows] = await connection.query("SELECT skill_id FROM SKILLS WHERE name = ?", [name]);
        let skill_id;
        if (skillRows.length > 0) {
            skill_id = skillRows[0].skill_id;
        } else {
            const [result] = await connection.query("INSERT INTO SKILLS (name) VALUES (?)", [name]);
            skill_id = result.insertId;
        }

        await connection.query(
            "INSERT IGNORE INTO STUDENT_SKILLS (student_id, skill_id) VALUES (?, ?)",
            [student_id, skill_id]
        );

        await connection.commit();
        res.status(201).json({ message: "Skill added", skill_id });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: "Failed to add skill" });
    } finally {
        connection.release();
    }
}

async function removeSkill(req, res) {
    const { skillId } = req.params;
    try {
        const student_id = await getStudentId(req.user.user_id);
        if (!student_id) return res.status(403).json({ error: "No student profile found for this account" });

        const [result] = await pool.query(
            "DELETE FROM STUDENT_SKILLS WHERE student_id = ? AND skill_id = ?",
            [student_id, skillId]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Skill link not found" });
        res.json({ message: "Skill removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove skill" });
    }
}

module.exports = {
    getProfile, updateProfile,
    addEducation, updateEducation, deleteEducation,
    addEmployment, updateEmployment, deleteEmployment,
    addReferee, updateReferee, deleteReferee,
    addSkill, removeSkill
};