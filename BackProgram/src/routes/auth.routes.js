const express = require('express');
const router = express.Router();
const { adminLogin, wechatLogin } = require('../controllers/auth.controller');

router.post('/admin/login', adminLogin);
router.post('/wechat/login', wechatLogin);

module.exports = router;
