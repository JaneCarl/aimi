const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', require('./routes/index.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/coaches', require('./routes/coach.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/course', require('./routes/course.routes'));
app.use('/api/schedules', require('./routes/schedule.routes'));
app.use('/api/leave-requests', require('./routes/leave.routes'));
app.use('/api/financial', require('./routes/financial.routes'));
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/class-records', require('./routes/classRecord.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/miniprogram', require('./routes/miniprogram.routes'));

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    code: 500,
    message: err.message || '服务器内部错误',
    data: null
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '请求的资源不存在',
    data: null
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
});

module.exports = app;
