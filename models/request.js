const pool = require("../config/db");

class Request {
  static async create({ user_id, service_id }) {
    const result = await pool.query(
      "INSERT INTO requests(user_id, service_id) VALUES($1,$2) RETURNING *",
      [user_id, service_id]
    );
    return result.rows[0];
  }

  static async all() {
    const result = await pool.query("SELECT * FROM requests ORDER BY created_at DESC");
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM requests WHERE id=$1", [id]);
    return result.rows[0];
  }

  static async findByUser(user_id) {
    const result = await pool.query("SELECT * FROM requests WHERE user_id=$1 ORDER BY created_at DESC", [user_id]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await pool.query("UPDATE requests SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
    return result.rows[0];
  }
}

module.exports = Request;
