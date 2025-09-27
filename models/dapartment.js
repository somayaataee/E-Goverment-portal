const pool = require("../config/db");

class Department {
  static async create(name) {
    const result = await pool.query("INSERT INTO departments(name) VALUES($1) RETURNING *", [name]);
    return result.rows[0];
  }

  static async all() {
    const result = await pool.query("SELECT * FROM departments");
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM departments WHERE id=$1", [id]);
    return result.rows[0];
  }
}

module.exports = Department;
