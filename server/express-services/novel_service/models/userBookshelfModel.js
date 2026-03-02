
const pool = require("../config/db");


async function updateLastViewTime(user_id, novel_id) {
  const [result] = await pool.query(`
    UPDATE user_bookshelf
    SET last_view_time = NOW()
    WHERE user_id = ? AND novel_id = ?
  `, [user_id, novel_id]);

  return result;
}

module.exports = {
  updateLastViewTime,
};