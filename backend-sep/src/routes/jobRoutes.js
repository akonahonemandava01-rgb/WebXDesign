const express = require("express");
const router = express.Router();
const {
    listJobs, getJob, listMatchedJobs,
    listMyJobs, getMyJob,
    createJob, updateJob, updateJobStatus
} = require("../controllers/jobController");
const { authenticate, authorize } = require("../middleware/auth");

// Public job board - anyone can browse (students, employers, visitors alike)
router.get("/", listJobs);

// Student: jobs filtered to their own eligibility (must be BEFORE /:id below,
// or Express would treat "matched" as a job_id)
router.get("/matched", authenticate, authorize("student"), listMatchedJobs);

// Employer: their own postings only - never another employer's
// (must also be BEFORE /:id below)
router.get("/mine", authenticate, authorize("employer"), listMyJobs);
router.get("/mine/:id", authenticate, authorize("employer"), getMyJob);

// Public: single approved job by id
router.get("/:id", getJob);

router.post("/", authenticate, authorize("employer"), createJob);
router.put("/:id", authenticate, authorize("employer"), updateJob);
router.put("/:id/status", authenticate, authorize("employer"), updateJobStatus);

module.exports = router;