const pool = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async create({ name, email, password, role, department_id, national_id, dob, contact_info }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users 
      (name, email, password, role, department_id, national_id, dob, contact_info) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const values = [name, email, hashedPassword, role, department_id || null, national_id || null, dob || null, contact_info || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    return result.rows[0];
  }
}

module.exports = User;
