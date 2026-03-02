const pool = require("../config/db");

// 根据用户名查用户
exports.findUserByUsername = async (username) => {
  const [rows] = await pool.query(
    'SELECT id, username, password FROM `user` WHERE username = ?',
    [username]
  );
  return rows[0];
};

// 根据用户ID查角色
exports.findRoleByUserId = async (userId) => {
  const [rows] = await pool.query(`
    SELECT r.id AS role_id, r.role_name
    FROM user_role ur
    JOIN role r ON ur.role_id = r.id
    WHERE ur.user_id = ?
  `, [userId]);
  return rows[0];
};

// 根据角色ID查权限
exports.findPermissionsByRoleId = async (roleId) => {
  const [rows] = await pool.query(`
    SELECT DISTINCT p.perm_key
    FROM role_permission rp
    JOIN permission p ON rp.perm_id = p.id
    WHERE rp.role_id = ?
  `, [roleId]);
  return rows.map(item => item.perm_key);
};

exports.findUserFullInfoById = async (userId) => {
  const [users] = await pool.query(
    'SELECT id, username FROM `user` WHERE id = ?',
    [userId]
  );
  if (users.length === 0) return null;
  const user = users[0];

  const role = await exports.findRoleByUserId(user.id);
  const permissions = role ? await exports.findPermissionsByRoleId(role.role_id) : [];

  return {
    id: user.id,
    username: user.username,
    role: role?.role_name || null,
    permissions: permissions
  };
};

// 根据角色名查角色
exports.findRoleByName = async (roleName) => {
  const [rows] = await pool.query(
    "SELECT id, role_name FROM role WHERE role_name = ?",
    [roleName]
  );
  return rows[0];
};

// 创建用户
exports.createUser = async (username, password) => {
  const [result] = await pool.query(
    "INSERT INTO user (username, password) VALUES (?, ?)",
    [username, password]
  );
  return result.insertId;
};

// 绑定用户角色
exports.bindUserRole = async (userId, roleId) => {
  await pool.query(
    "INSERT INTO user_role (user_id, role_id) VALUES (?, ?)",
    [userId, roleId]
  );
};

//删除用户
exports.deleteUserById = async (userId) => {
  const [result] = await pool.query(
    "DELETE FROM `user` WHERE id = ?",
    [userId]
  );
  return result;
};

// 查询所有用户 
exports.findAllUsers = async () => {
  const [rows] = await pool.query(`
    SELECT 
    u.id,
    u.username,
    u.created_at
  FROM user u
  ORDER BY u.id ASC;
  `);

  return rows;
};