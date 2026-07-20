const express = require("express");
const router = express.Router();
const {
    listEmployers,
    reviewEmployer,
    listJobsForReview,
    reviewJob,
    getStats
} = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/employers", authenticate, authorize("admin"), listEmployers);
router.put("/employers/:id", authenticate, authorize("admin"), reviewEmployer);

router.get("/jobs", authenticate, authorize("admin"), listJobsForReview);
router.put("/jobs/:id", authenticate, authorize("admin"), reviewJob);

router.get("/stats", authenticate, authorize("admin"), getStats);

module.exports = router;