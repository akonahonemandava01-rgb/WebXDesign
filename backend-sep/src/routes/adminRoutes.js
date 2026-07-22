const express = require("express");
const router = express.Router();
const {
    listEmployers,
    reviewEmployer,
    listJobsForReview,
    reviewJob,
    getStats,
    listPlacements,
    getEmployerDetails,
    getJobDetails
} = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/employers", authenticate, authorize("admin"), listEmployers);
router.put("/employers/:id", authenticate, authorize("admin"), reviewEmployer);

router.get("/jobs", authenticate, authorize("admin"), listJobsForReview);
router.put("/jobs/:id", authenticate, authorize("admin"), reviewJob);

router.get("/stats", authenticate, authorize("admin"), getStats);
router.get("/placements", authenticate, authorize("admin"), listPlacements);
router.get("/employers/:id", authenticate, authorize("admin"), getEmployerDetails);
router.get("/jobs/:id", authenticate, authorize("admin"), getJobDetails);

module.exports = router;