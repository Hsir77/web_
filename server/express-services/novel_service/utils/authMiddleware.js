const jwt = require('jsonwebtoken');
const loginModel = require("../models/loginModel");

const JWT_SECRET = 'your_secret_key_2026';

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ 只从 cookie 读取
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未登录'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    const userInfo = await loginModel.findUserFullInfoById(decoded.userId);

    if (!userInfo) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在'
      });
    }

    req.user = userInfo;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: '登录已过期或无效'
    });
  }
};

module.exports = authMiddleware;