const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');

    // 创建管理员账号
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminResult = await db.query(
      'INSERT INTO admins (username, password, name) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING *',
      ['admin', hashedPassword, '系统管理员']
    );

    if (adminResult.rows.length > 0) {
      console.log('创建管理员账号成功');
      console.log('用户名: admin');
      console.log('密码: admin123');
    } else {
      console.log('管理员账号已存在');
    }

    // 创建示例课程
    const courses = [
      { name: '初级泰拳课', level: '初级', description: '适合5-8岁儿童，基础动作训练' },
      { name: '中级泰拳课', level: '中级', description: '适合8-12岁儿童，进阶技巧' },
      { name: '高级散打课', level: '高级', description: '适合12岁以上，实战训练' }
    ];

    for (const course of courses) {
      await db.query(
        'INSERT INTO courses (name, level, description) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [course.name, course.level, course.description]
      );
    }
    console.log('创建示例课程成功');

    // 创建示例轮播图
    await db.query(
      `INSERT INTO banners (image, title, order_num, status) 
       VALUES ('https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=春季特惠', '春季特惠活动', 1, 'active')
       ON CONFLICT DO NOTHING`
    );

    await db.query(
      `INSERT INTO banners (image, title, order_num, status) 
       VALUES ('https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=新班开课', '新班开课啦', 2, 'active')
       ON CONFLICT DO NOTHING`
    );
    console.log('创建示例轮播图成功');

    console.log('数据库初始化完成！');
    process.exit(0);
  } catch (err) {
    console.error('初始化失败:', err);
    process.exit(1);
  }
}

initDatabase();
