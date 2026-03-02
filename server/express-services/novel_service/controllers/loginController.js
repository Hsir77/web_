const loginModel = require("../models/loginModel");

const jwt = require("jsonwebtoken");
const md5 = require("md5");
// JWT 配置
const JWT_SECRET = "your_secret_key_2026";
const EXPIRES_IN = "7d";

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await loginModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    if (user.password !== md5(password)) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    const role = await loginModel.findRoleByUserId(user.id);
    const permissions = role
      ? await loginModel.findPermissionsByRoleId(role.role_id)
      : [];

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: role?.role_name,
        permissions,
      },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "登录成功",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "服务器错误" });
  }
}

async function register(req, res) {
  try {
    if (!req.user.permissions.includes("user:create")) {
      return res.status(403).json({ message: "没有权限" });
    }

    const { username, password, role_name } = req.body;

    const exist = await loginModel.findUserByUsername(username);
    if (exist) {
      return res.status(400).json({ message: "用户已存在" });
    }

    const role = await loginModel.findRoleByName(role_name);
    if (!role) {
      return res.status(400).json({ message: "角色不存在" });
    }

    const userId = await loginModel.createUser(
      username,
      md5(password)
    );

    await loginModel.bindUserRole(userId, role.id);

    return res.json({
      message: "注册成功",
      data: {
        userId,
        username,
        role: role.role_name
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误" });
  }
}

async function deleteUser(req, res) {
  try {
    if (!req.user.permissions.includes("user:delete")) {
      return res.status(403).json({ message: "没有权限" });
    }
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "username不能为空" });
    }

    const user = await loginModel.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    await loginModel.deleteUserById(user.id);

    return res.json({
      message: "删除成功",
      username
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "服务器错误" });
  }
}

async function getCurrentUser(req, res) {
  try {
    return res.json({
      message: "获取成功",
      data: req.user,
    });
  } catch (err) {
    return res.status(401).json({ message: "登录已过期或无效" });
  }
}

// 获取用户列表
async function getUserList(req, res) {
  try {
    // ✅ 权限校验
    if (!req.user.permissions.includes("user:list")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }

    // ✅ 查数据
    const users = await loginModel.findAllUsers();

    return res.json({
      message: "获取成功",
      data: users
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "服务器错误"
    });
  }
}

module.exports = {
  login,
  getCurrentUser,
  register,
  deleteUser,
  getUserList
};
