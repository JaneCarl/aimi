const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证令牌',
        data: null
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '无效的认证令牌',
      data: null
    });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: '需要管理员权限',
      data: null
    });
  }
  next();
};

const coachAuth = (req, res, next) => {
  if (req.user.role !== 'coach') {
    return res.status(403).json({
      code: 403,
      message: '需要教练权限',
      data: null
    });
  }
  next();
};

const parentAuth = (req, res, next) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({
      code: 403,
      message: '需要家长权限',
      data: null
    });
  }
  next();
};

module.exports = { auth, adminAuth, coachAuth, parentAuth };
