const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const officerController = require("../controllers/officerController");

router.get("/dashboard", verifyToken, officerController.dashboard);
router.get("/request/:request_id/documents", verifyToken, officerController.viewDocuments);

module.exports = router;
