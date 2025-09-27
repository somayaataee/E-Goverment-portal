const pool = require("../config/db");

class Service {
  static async create({ name, department_id, fee }) {
    const result = await pool.query(
      "INSERT INTO services(name, department_id, fee) VALUES($1,$2,$3) RETURNING *",
      [name, department_id, fee || 0]
    );
    return result.rows[0];
  }

  static async all() {
    const result = await pool.query("SELECT * FROM services");
    return result.rows;
  }

  static async findByDepartment(department_id) {
    const result = await pool.query("SELECT * FROM services WHERE department_id=$1", [department_id]);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM services WHERE id=$1", [id]);
    return result.rows[0];
  }
}

module.exports = Service;
