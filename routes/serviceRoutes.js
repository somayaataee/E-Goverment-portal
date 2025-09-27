// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { isCitizen } = require("../middleware/roleMiddleware");
const landingController = require("../controllers/landingController");

const pool = require("../config/db");

router.get("/", landingController.showServices);

router.get("/", async (req, res) => {
  try {
    const servicesResult = await pool.query("SELECT * FROM services ORDER BY id ASC");
    const services = servicesResult.rows;
    const user = (req.session && req.session.user) || req.user || null;
    res.render("services", { services, user });
  } catch (err) {
    console.error("Services GET Error:", err);
    res.status(500).send("Server Error");
  }
});


router.post("/request/:id", verifyToken, isCitizen, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user.id;

    const serviceCheck = await pool.query("SELECT id FROM services WHERE id=$1", [serviceId]);
    if (!serviceCheck.rows.length) return res.status(400).send("invalid service");

    await pool.query(
      "INSERT INTO requests (user_id, service_id, status, created_at) VALUES ($1,$2,'Submitted',NOW())",
      [userId, serviceId]
    );

    res.redirect("/services");
  } catch (err) {
    console.error("Service Request POST Error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
