const express = require("express");
const router = express.Router();
const {
    getProfile, updateProfile,
    addEducation, updateEducation, deleteEducation,
    addEmployment, updateEmployment, deleteEmployment,
    addReferee, updateReferee, deleteReferee,
    addSkill, removeSkill
} = require("../controllers/studentController");
const { authenticate, authorize } = require("../middleware/auth");

// Every route here is a student acting on their own profile
router.use(authenticate, authorize("student"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/education", addEducation);
router.put("/education/:id", updateEducation);
router.delete("/education/:id", deleteEducation);

router.post("/employment", addEmployment);
router.put("/employment/:id", updateEmployment);
router.delete("/employment/:id", deleteEmployment);

router.post("/referees", addReferee);
router.put("/referees/:id", updateReferee);
router.delete("/referees/:id", deleteReferee);

router.post("/skills", addSkill);
router.delete("/skills/:skillId", removeSkill);

module.exports = router;