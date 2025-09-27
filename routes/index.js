const express = require("express");
const router = express.Router();

const citizenController = require("../controllers/citizenController");
const officerController = require("../controllers/officerController");
const adminController = require("../controllers/adminController");


router.get("/", (req, res) => {
  res.render("index");
});

router.get("/citizen/login", citizenController.showLogin);
router.post("/citizen/login", citizenController.login);
router.get("/citizen/register", citizenController.showRegister);
router.post("/citizen/register", citizenController.register);
router.get("/citizen/dashboard", citizenController.dashboard);


router.get("/officer/login", officerController.showLogin);
router.post("/officer/login", officerController.login);
router.get("/officer/dashboard", officerController.dashboard);

router.get("/admin/login", adminController.showLogin);
router.post("/admin/login", adminController.login);
router.get("/admin/dashboard", adminController.dashboard);

module.exports = router;

