const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/applicationController");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", authenticate, authorize("student"), applyToJob);
router.get("/me", authenticate, authorize("student"), myApplications);
router.put("/:id/withdraw", authenticate, authorize("student"), withdrawApplication);

router.post("/:id/documents", authenticate, authorize("student"), upload.single("file"), uploadDocument);
router.get("/:id/documents", authenticate, authorize("student"), listDocuments);
router.delete("/:id/documents/:documentId", authenticate, authorize("student"), deleteDocument);
router.get(
    "/:id/documents/:documentId/download",
    authenticate,
    authorize("student", "employer"),
    downloadDocument
);

router.get("/job/:jobId", authenticate, authorize("employer"), jobApplicants);
router.get("/job/:jobId/export", authenticate, authorize("employer"), exportApplicants);
router.put("/:id/status", authenticate, authorize("employer"), updateApplicationStatus);

module.exports = router;