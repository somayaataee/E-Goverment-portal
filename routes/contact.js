const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.get("/citizen/contact", contactController.showContactForm);

router.post("/citizen/contact", contactController.submitContactForm);

module.exports = router;
