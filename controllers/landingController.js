
const pool = require("../config/db");

exports.showServices = async (req, res) => {
  try {

    const departmentsResult = await pool.query("SELECT * FROM departments");
    const departments = departmentsResult.rows;

    const servicesResult = await pool.query("SELECT * FROM services");
    const services = servicesResult.rows;

    res.render("services", { user: req.session.user, departments, services });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
