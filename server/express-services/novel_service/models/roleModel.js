const pool = require("../config/db");

// 查询所有用户角色（关联user、role、user_role三张表）
exports.getUserRoles = async () => {
  const [rows] = await pool.query(`
    SELECT 
      u.id AS user_id,
      u.username,
      r.id AS role_id,
      r.role_name
    FROM user u
    LEFT JOIN user_role ur ON u.id = ur.user_id
    LEFT JOIN role r ON ur.role_id = r.id
    ORDER BY u.id ASC
  `);
  return rows;
};

// 修改用户角色（核心逻辑：操作user_role表）
exports.assignUserRole = async (username, role_name) => {
  const [userRows] = await pool.query("SELECT id FROM user WHERE username = ?", [username]);
  if (userRows.length === 0) {
    throw new Error("用户不存在");
  }
  const userId = userRows[0].id;

  const [roleRows] = await pool.query("SELECT id FROM role WHERE role_name = ?", [role_name]);
  if (roleRows.length === 0) {
    throw new Error("角色不存在");
  }
  const roleId = roleRows[0].id;

  await pool.query("DELETE FROM user_role WHERE user_id = ?", [userId]);

  const [result] = await pool.query(
    "INSERT INTO user_role (user_id, role_id) VALUES (?, ?)",
    [userId, roleId]
  );

  return {
    username,
    userId,
    role_name,
    roleId,
    affectedRows: result.affectedRows
  };
};