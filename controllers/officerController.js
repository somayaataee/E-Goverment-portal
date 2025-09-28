
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.showLoginForm = (req, res) => {
  res.render("officer/officerLogin", { error: null });
};

exports.loginOfficer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role='officer'",
      [email]
    );

    const officer = result.rows[0];
    if (!officer) return res.render("officer/officerLogin", { error: "Email or password is incorrect." });

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) return res.render("officer/officerLogin", { error: "Email or password is incorrect." });


    const token = jwt.sign(
      {
        id: officer.id,
        name: officer.name,
        role: officer.role,
        department_id: officer.department_id || null
      },
      process.env.JWT_SECRET || "CHANGE_THIS_SECRET",
      { expiresIn: "2h" }
    );

    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000
    });

 
    if (req.session) {
      req.session.user = {
        id: officer.id,
        role: officer.role,
        name: officer.name,
        department_id: officer.department_id || null
      };
      req.session.officerId = officer.id;
    }

    return res.redirect("/officer/dashboard");

  } catch (err) {
    console.error("Officer login error:", err);
    res.status(500).send("Server Error");
  }
};


exports.dashboard = async (req, res) => {
  try {
    const officer = req.user;

    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) AS "totalRequests",
        COUNT(*) FILTER (WHERE status='Submitted') AS "pending",
        COUNT(*) FILTER (WHERE status='Approved') AS "approved",
        COUNT(*) FILTER (WHERE status='Rejected') AS "rejected"
      FROM requests r
      JOIN services s ON r.service_id = s.id
      WHERE s.department_id = $1
    `, [officer.department_id]);

    const stats = statsResult.rows[0];

    const requestsResult = await pool.query(`
      SELECT r.id, u.name AS citizen_name, s.name AS service_name, r.status, r.created_at
      FROM requests r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      WHERE s.department_id = $1
      ORDER BY r.created_at DESC
    `, [officer.department_id]);

    const requests = requestsResult.rows;

    res.render("officer/officerDashboard", { officer, stats, requests });
  } catch (err) {
    console.error("Officer dashboard error:", err);
    res.status(500).send("Server Error");
  }
};


exports.viewRequest = async (req, res) => {
  try {
    const officer = req.user;
    const requestId = parseInt(req.params.id);

    const result = await pool.query(`
      SELECT r.id, r.status, r.created_at, u.name AS citizen_name, u.email AS citizen_email,
             s.name AS service_name, s.fee
      FROM requests r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      WHERE r.id=$1 AND s.department_id=$2
    `, [requestId, officer.department_id]);

    if (result.rows.length === 0) return res.status(404).send("Request not found or access denied");
    const request = result.rows[0];

    const docsResult = await pool.query(
      "SELECT id, file_name, file_path, uploaded_at FROM documents WHERE request_id=$1 ORDER BY uploaded_at DESC",
      [requestId]
    );
    const documents = docsResult.rows;

    res.render("officer/viewRequest", { request, documents });
  } catch (err) {
    console.error("View request error:", err);
    res.status(500).send("Server Error");
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const officer = req.user;
    const requestId = parseInt(req.params.id);
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) return res.status(400).send("Invalid status");

    await pool.query(`
      UPDATE requests 
      SET status=$1 
      WHERE id=$2 AND id IN (
        SELECT r.id 
        FROM requests r
        JOIN services s ON r.service_id = s.id
        WHERE s.department_id=$3
      )
    `, [status, requestId, officer.department_id]);

    res.redirect("/officer/dashboard");
  } catch (err) {
    console.error("Update request status error:", err);
    res.status(500).send("Server Error");
  }
};
