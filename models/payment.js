const pool = require("../config/db");

class Payment {
  static async create({ request_id, amount }) {
    const result = await pool.query(
      "INSERT INTO payments(request_id, amount, status) VALUES($1,$2,'Paid') RETURNING *",
      [request_id, amount]
    );
    return result.rows[0];
  }

  static async findByRequest(request_id) {
    const result = await pool.query("SELECT * FROM payments WHERE request_id=$1", [request_id]);
    return result.rows;
  }
}

module.exports = Payment;
