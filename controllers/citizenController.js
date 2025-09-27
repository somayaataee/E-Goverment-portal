// controllers/citizenController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.showRegister = (req, res) => res.render("citizen/register", { error: null });
exports.showLogin = (req, res) => res.render("citizen/login", { error: null });


exports.register = async (req, res) => {
  try {
    const { name, email, password, national_id, dob } = req.body;
    if (!name || !email || !password) return res.render("citizen/register", { error: "require email,password and name!" });

    const exists = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);
    if (exists.rows.length) return res.render("citizen/register", { error: "This email was sumitted!" });

    const hashed = await bcrypt.hash(password, 10);
    const inserted = await pool.query(
      "INSERT INTO users (name, email, password, role, department_id, national_id, dob) VALUES ($1,$2,$3,'citizen',NULL,$4,$5) RETURNING id, role",
      [name, email, hashed, national_id || null, dob || null]
    );

    const user = inserted.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, maxAge: 24*60*60*1000 });
    return res.redirect("/citizen/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("citizen/register", { error: " error submit" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.render("citizen/login", { error: "require email and password" });

    const result = await pool.query("SELECT * FROM users WHERE email=$1 AND role='citizen'", [email]);
    if (!result.rows.length) return res.render("citizen/login", { error: "incorrect email or password " });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.render("citizen/login", { error: "incorrect email or password " });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, maxAge: 24*60*60*1000 });
    return res.redirect("/citizen/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("citizen/login", { error: "login error" });
  }
};



exports.dashboard = async (req, res) => {
  try {
    const user_id = req.user.id;

    const reqs = await pool.query(
      `SELECT 
         r.id, 
         COALESCE(s.name, 'Service not found') AS service_name, 
         r.status, 
         r.created_at
       FROM requests r
       LEFT JOIN services s ON r.service_id = s.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [user_id]
    );

    const requests = reqs.rows.map(r => ({
      id: r.id,
      service_name: r.service_name,
      status: r.status,
      created_at: r.created_at ? new Date(r.created_at) : null
    }));

    const notes = await pool.query(
      "SELECT id, message, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    return res.render("citizen/dashboard", {
      user: req.user,
      requests,
      notifications: notes.rows
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).send("Server Error");
  }
};


exports.applyServiceForm = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM services ORDER BY id ASC");
    const services = result.rows;
    res.render("citizen/apply", { citizen: req.user, services, error: null });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.render("citizen/apply", { citizen: req.user, services: [], error: "error in service" });
  }
};

exports.submitServiceRequest = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { service_id } = req.body;

    if (!service_id) {
      return res.render("citizen/apply", { error: "Please select a service.", services: await getAllServices() });
    }

   
    await pool.query(
      `INSERT INTO requests (user_id, service_id, status) 
       VALUES ($1, $2, 'Submitted')`,
      [user_id, service_id]
    );

    res.redirect("/citizen/dashboard");
  } catch (err) {
    console.error("Submit Request Error:", err);
    res.status(500).send("Server Error");
  }
};


async function getAllServices() {
  const result = await pool.query("SELECT id, name, fee FROM services ORDER BY name ASC");
  return result.rows;
}


exports.createRequest = async (req, res) => {
  try {
    const { service_id } = req.body;
    if (!service_id) return res.status(400).send("service_id is require");
    const serviceCheck = await pool.query("SELECT id FROM services WHERE id=$1", [service_id]);
    if (!serviceCheck.rows.length) return res.status(400).send("invalid selected service");
    const inserted = await pool.query("INSERT INTO requests (user_id, service_id, status, created_at) VALUES ($1,$2,'Submitted',NOW()) RETURNING id", [req.user.id, service_id]);
    const requestId = inserted.rows[0].id;
    if (req.files && req.files.length) {
      for (const file of req.files) {
        await pool.query("INSERT INTO documents (request_id, file_name, file_path) VALUES ($1,$2,$3)", [requestId, file.originalname, file.path]);
      }
    }
    return res.redirect("/citizen/dashboard");
  } catch (err) {
    console.error("createRequest Error:", err);
    return res.status(500).send("Server Error");
  }
};


exports.submitContact = async (req,res) => {
  try {
    const { name,email,message } = req.body;
    if(!name || !email || !message) return res.send("please fill out all feild");
    await pool.query("INSERT INTO contacts (name,email,message) VALUES ($1,$2,$3)", [name,email,message]);
    res.send("sent your massage");
  } catch(err) {
    console.error("Contact Error:",err);
    res.status(500).send("Server Error");
  }
};





exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("no aploading file");
    if (!req.body.request_id) return res.status(400).send("request_id is require");

    await pool.query(
      "INSERT INTO documents (request_id, file_name, file_path) VALUES ($1,$2,$3)",
      [req.body.request_id, req.file.originalname, req.file.path]
    );

    return res.redirect("/citizen/dashboard");
  } catch (err) {
    console.error("uploadDocument Error:", err);
    return res.status(500).send("Server Error");
  }
};


exports.createRequest = async (req, res) => {
  try {
    const { service_id } = req.body;
    if (!service_id) return res.status(400).send("service_id is require");

   
    const serviceCheck = await pool.query("SELECT id FROM services WHERE id=$1", [service_id]);
    if (!serviceCheck.rows.length) return res.status(400).send("invalid selected service");

    const inserted = await pool.query(
      "INSERT INTO requests (user_id, service_id, status, created_at) VALUES ($1,$2,'Submitted',NOW()) RETURNING id",
      [req.user.id, service_id]
    );
    const requestId = inserted.rows[0].id;

    if (req.files && req.files.length) {
      for (const file of req.files) {
        await pool.query(
          "INSERT INTO documents (request_id, file_name, file_path) VALUES ($1,$2,$3)",
          [requestId, file.originalname, file.path]
        );
      }
    }

    return res.redirect("/citizen/dashboard");
  } catch (err) {
    console.error("createRequest Error:", err);
    return res.status(500).send("Server Error");
  }
};


exports.getNotifications = async (req, res) => {
  try {
    const notes = await pool.query(
      "SELECT id, message, created_at FROM notifications WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id]
    );
    return res.render("citizen/notifications", { notifications: notes.rows });
  } catch (err) {
    console.error("getNotifications Error:", err);
    return res.status(500).send("Server Error");
  }
};
