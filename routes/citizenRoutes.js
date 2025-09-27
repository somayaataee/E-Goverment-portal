const express = require("express");
const router = express.Router();
const citizenController = require("../controllers/citizenController");
const documentController = require("../controllers/documentController");
const { verifyToken } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/register", citizenController.showRegister);
router.get("/login", citizenController.showLogin);
router.get("/dashboard", verifyToken, citizenController.dashboard);
router.get("/apply", verifyToken, citizenController.applyServiceForm);
router.get("/notifications", verifyToken, citizenController.getNotifications);

router.get("/documents/:request_id", verifyToken, documentController.getDocumentsByRequest);

router.post("/apply", verifyToken, citizenController.submitServiceRequest);

router.post("/request", verifyToken, upload.array("documents", 5), citizenController.createRequest);

router.post("/documents/:request_id", verifyToken, upload.single("document"), documentController.uploadDocument);


router.post("/register", citizenController.register);
router.post("/login", citizenController.login);

module.exports = router;
