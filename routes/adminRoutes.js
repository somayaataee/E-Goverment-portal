const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/sessionAuth");


router.get("/login", adminController.showLogin);

router.post("/login", adminController.postLogin);

router.post("/departments/add",adminController.addDepartment);

router.get("/dashboard", verifyAdmin, adminController.dashboardStats);

router.get("/users", verifyAdmin, adminController.getUsers);

router.get("/departments", verifyAdmin, adminController.getDepartments);

router.get("/services", verifyAdmin, adminController.getServices);

module.exports = router;
