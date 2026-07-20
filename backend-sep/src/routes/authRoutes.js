const express = require("express");
const router = express.Router();
const {
    registerStudent, registerEmployer, login, forgotPassword, resetPassword
} = require("../controllers/authController");

router.post("/register/student", registerStudent);
router.post("/register/employer", registerEmployer);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;