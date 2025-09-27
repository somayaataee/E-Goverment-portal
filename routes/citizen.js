const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const documentController = require("../controllers/documentController");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


router.get("/documents/:request_id", verifyToken, documentController.showUploadForm);


router.post("/documents/:request_id", verifyToken, upload.single("document"), documentController.uploadDocument);

module.exports = router;
