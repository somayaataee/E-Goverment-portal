const pool = require("../config/db");
const bcrypt = require("bcrypt");


exports.register = async (req, res) => {
  try {
    const { name, national_id, dob, email, password, role, department_id } = req.body;

    if (!name || !email || !password) {
      return res.render("auth/register", { error: " please fill out all  fields!", success: null });
    }

  
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.render("auth/register", { error: "Email was submited", success: null });
    }

  
    if (national_id) {
      const idCheck = await pool.query("SELECT * FROM users WHERE national_id = $1", [national_id]);
      if (idCheck.rows.length > 0) {
        return res.render("auth/register", { error: "code was submited!", success: null });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (name, national_id, dob, email, password, role, department_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        national_id || null,
        dob || null,
        email,
        hashedPassword,
        role || "citizen",
        department_id || null,
      ]
    );

    const user = newUser.rows[0];

  
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    if (user.role === "citizen") return res.redirect("/citizen/dashboard");
    if (user.role === "officer") return res.redirect("/officer/dashboard");
    if (user.role === "admin") return res.redirect("/admin/dashboard");

  } catch (error) {
    console.error("Register Error:", error);
    res.render("auth/register", { error: "error submit", success: null });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("auth/login", { error: "email and password are required", success: null });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.render("auth/login", { error: "Not found this user with this email", success: null });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("auth/login", { error: "incorrect password", success: null });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    if (user.role === "citizen") return res.redirect("/citizen/dashboard");
    if (user.role === "officer") return res.redirect("/officer/dashboard");
    if (user.role === "admin") return res.redirect("/admin/dashboard");

  } catch (error) {
    console.error("Login Error:", error);
    res.render("auth/login", { error: "login error", success: null });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token"); 
  res.redirect("/login");   
};
