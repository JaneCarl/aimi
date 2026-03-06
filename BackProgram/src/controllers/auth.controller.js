const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');
require('dotenv').config();

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return error(res, '用户名或密码错误');
    }

    const admin = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return error(res, '用户名或密码错误');
    }

    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    success(res, {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    }, '登录成功');
  } catch (err) {
    console.error('管理员登录错误:', err);
    error(res, '服务器错误');
  }
};

const wechatLogin = async (req, res) => {
  const { openid, role, nickname } = req.body;

  try {
    let userInfo;

    if (role === 'coach') {
      let result = await db.query(
        'SELECT * FROM coaches WHERE openid = $1',
        [openid]
      );

      if (result.rows.length === 0) {
        result = await db.query(
          'INSERT INTO coaches (openid, nickname) VALUES ($1, $2) RETURNING *',
          [openid, nickname || '教练']
        );
      }

      userInfo = result.rows[0];
    } else if (role === 'parent') {
      let result = await db.query(
        'SELECT * FROM parents WHERE openid = $1',
        [openid]
      );

      if (result.rows.length === 0) {
        result = await db.query(
          'INSERT INTO parents (openid, nickname) VALUES ($1, $2) RETURNING *',
          [openid, nickname || '家长']
        );
      }

      userInfo = result.rows[0];
    } else {
      return error(res, '无效的角色类型');
    }

    const token = jwt.sign(
      { id: userInfo.id, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    success(res, {
      token,
      userInfo: {
        id: userInfo.id,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar || ''
      }
    }, '登录成功');
  } catch (err) {
    console.error('微信登录错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  adminLogin,
  wechatLogin
};
