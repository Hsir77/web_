const roleModel = require("../models/roleModel");

// 查看用户角色列表
async function getUserRoleList(req, res) {
  try {
    if (!req.user.permissions.includes("role:assign")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }

    const data = await roleModel.getUserRoles();

    return res.json({
      message: "获取成功",
      data
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "服务器错误"
    });
  }
}

// 给用户分配/修改角色
async function userRoleChange(req, res) {
  try {
    if (!req.user.permissions.includes("role:assign")) {
      return res.status(403).json({
        message: "当前用户没有权限修改角色"
      });
    }

    const { username, role_name } = req.body;
    if (!username || !role_name) {
      return res.status(400).json({
        message: "用户名和角色名不能为空"
      });
    }

    const allowedRoles = ["管理员", "登录用户"]; 
    if (!allowedRoles.includes(role_name)) {
      return res.status(400).json({
        message: `仅支持分配以下角色：${allowedRoles.join("、")}`
      });
    }

    const result = await roleModel.assignUserRole(username, role_name);

    return res.json({
      message: "角色修改成功",
      data: result
    });

  } catch (err) {
    console.error("修改角色失败:", err);
    if (err.message === "用户不存在" || err.message === "角色不存在") {
      return res.status(404).json({
        message: err.message
      });
    }
    return res.status(500).json({
      message: "服务器错误"
    });
  }
}

module.exports = {
  getUserRoleList,
  userRoleChange 
};