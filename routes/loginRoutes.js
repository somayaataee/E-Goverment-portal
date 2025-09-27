const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET_FOR_PROD";

router.get("/login", (req, res) => {
  res.render("login", { title: "login system", error: null });
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  console.log("POST /auth/login body:", req.body);

  if (!email || !password || !role) {
    return res.render("login", { title: "login system", error: "please fill out all feilds!" });
  }

  try {
    const q = "SELECT id, password, role, name FROM users WHERE email=$1";
    const dbRes = await pool.query(q, [email]);
    console.log("DB user rows:", dbRes.rows);

    if (!dbRes.rows.length) {
      return res.render("login", { title: "login system", error: "inccorect email or password" });
    }

    const user = dbRes.rows[0];

    if (user.role !== role) {
      return res.render("login", { title: "login system", error: "invalid selected role" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("bcrypt compare result:", match);

    if (!match) {
      return res.render("login", { title: "login system", error: "inccorect email or password " });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    if (user.role === "admin") return res.redirect("/admin/dashboard");
    if (user.role === "officer") return res.redirect("/officer/dashboard");
    if (user.role === "citizen") return res.redirect("/citizen/dashboard");
    return res.redirect("/");
  } catch (err) {
    console.error("Auth login error:", err);
    return res.render("login", { title: "login system", error: "login error , check the server." });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/auth/login");
});

module.exports = router;
