const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API服务正常运行' });
});

module.exports = router;
