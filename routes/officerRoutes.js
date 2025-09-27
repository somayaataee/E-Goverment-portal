const express = require("express");
const router = express.Router();
const officerController = require("../controllers/officerController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isOfficer } = require("../middleware/roleMiddleware");


router.get("/login", officerController.showLoginForm);
router.post("/login", officerController.loginOfficer);
router.get("/dashboard", verifyToken, isOfficer, officerController.dashboard);

router.get("/request/:id", verifyToken, isOfficer, officerController.viewRequest);

router.post("/request/:id/status", verifyToken, isOfficer, officerController.updateRequestStatus);

module.exports = router;
