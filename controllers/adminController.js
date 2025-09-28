
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.showLogin = (req, res) => {
  res.render("admin/login", { error: null });
};


exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role='admin'",
      [email]
    );

    const admin = result.rows[0];
    if (!admin) {
      return res.render("admin/login", { error: "User not found!" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.render("admin/login", { error: "Incorrect password!" });
    }

   
    const token = jwt.sign(
      { id: admin.id, role: admin.role, name: admin.name },
      process.env.JWT_SECRET || "CHANGE_THIS_SECRET",
      { expiresIn: "1d" }
    );

    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // لوکال تست: false | production: true
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    
    if (req.session) {
      req.session.user = { id: admin.id, role: admin.role, name: admin.name };
      req.session.adminId = admin.id; 
    }

    return res.redirect("/admin/dashboard");

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).send("Server Error");
  }
};

exports.dashboardStats = async (req, res) => {
  try {
    const totalRequests = await pool.query("SELECT COUNT(*) FROM requests");
    const approved = await pool.query("SELECT COUNT(*) FROM requests WHERE status='Approved'");
    const rejected = await pool.query("SELECT COUNT(*) FROM requests WHERE status='Rejected'");
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
    const totalServices = await pool.query("SELECT COUNT(*) FROM services");

    res.render("admin/dashboard", {
      stats: {
        totalRequests: totalRequests.rows[0].count,
        approved: approved.rows[0].count,
        rejected: rejected.rows[0].count,
        totalUsers: totalUsers.rows[0].count,
        totalServices: totalServices.rows[0].count
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, d.name AS department_name
       FROM users u LEFT JOIN departments d ON u.department_id=d.id`
    );
    res.render("admin/users", { users: users.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


exports.addDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query("INSERT INTO departments(name) VALUES($1)", [name]);
    res.redirect("/admin/departments");  
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding department");
  }
};


exports.getDepartments = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name FROM departments ORDER BY id ASC`);
    const departments = result.rows.map(dep => ({ id: dep.id, name: dep.name }));
    res.render("admin/departments", { departments });
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).send("Server Error");
  }
};


exports.getServices = async (req, res) => {
  try {
    const query = `
      SELECT s.id AS service_id,
             s.name AS service_name,
             s.fee AS service_fee,
             d.name AS department_name
      FROM services s
      JOIN departments d ON s.department_id = d.id
      ORDER BY s.id ASC
    `;

    const result = await pool.query(query);

    const services = result.rows.map(row => ({
      id: row.service_id,
      name: row.service_name,
      fee: row.service_fee,
      department_name: row.department_name
    }));

    res.render("admin/services", { services });

  } catch (err) {
    console.error("Error in getServices:", err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};
