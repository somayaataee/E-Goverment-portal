const pool = require("../config/db"); 


exports.showContactForm = (req, res) => {
  const user = (req.session && req.session.user) || req.user || null;
  res.render("contact", { user, message: null, error: null });
};


exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.render("contact", { error: "please fill out all feilds!", message: null });
    }

  
    await pool.query(
      "INSERT INTO contacts (name, email, message, created_at) VALUES ($1,$2,$3,NOW())",
      [name, email, message]
    );

    res.render("contact", { message: "succssfully send your massege", error: null });
  } catch (err) {
    console.error("Contact form error:", err);
    res.render("contact", { error: "error in send massege", message: null });
  }
};
