const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", (req, res) => res.render("auth/login"));
router.get("/register", (req, res) => res.render("auth/register"));

router.post("/register", authController.register);
router.post("/login", authController.login);



router.get("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error("exit erro:", err);
          return res.send("❌ خروج ناموفق بود");
        }
        res.redirect("/login");
      });
    } else {
      res.redirect("/login");
    }
  });

module.exports = router;
