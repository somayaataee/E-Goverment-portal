const pool = require("../config/db");

class Document {
  static async create({ request_id, filename, filepath }) {
    const result = await pool.query(
      "INSERT INTO documents(request_id, filename, filepath) VALUES($1,$2,$3) RETURNING *",
      [request_id, filename, filepath]
    );
    return result.rows[0];
  }

  static async findByRequest(request_id) {
    const result = await pool.query("SELECT * FROM documents WHERE request_id=$1", [request_id]);
    return result.rows;
  }
}

module.exports = Document;
