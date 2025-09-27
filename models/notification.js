const pool = require("../config/db");

class Notification {
  static async create({ user_id, message }) {
    const result = await pool.query(
      "INSERT INTO notifications(user_id, message) VALUES($1,$2) RETURNING *",
      [user_id, message]
    );
    return result.rows[0];
  }

  static async findByUser(user_id) {
    const result = await pool.query("SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC", [user_id]);
    return result.rows;
  }

  static async markAsRead(id) {
    const result = await pool.query("UPDATE notifications SET read=true WHERE id=$1 RETURNING *", [id]);
    return result.rows[0];
  }
}

module.exports = Notification;
