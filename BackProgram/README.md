# 艾米格斗少儿培训机构 - 后台管理系统后端

## 技术栈
- Node.js + Express
- PostgreSQL
- JWT认证

## 安装步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
编辑 `.env` 文件：
```
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aimi_fighting
DB_USER=postgres
DB_PASSWORD=postgres

# JWT密钥
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 3. 创建数据库
```bash
# 使用psql创建数据库
createdb aimi_fighting

# 导入数据库表结构
psql -U postgres -d aimi_fighting -f database/schema.sql
```

### 4. 初始化数据
```bash
node init.js
```

这将创建默认管理员账号：
- 用户名: admin
- 密码: admin123

### 5. 启动服务器
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器将在 http://localhost:3000 启动

## API文档
详细的API文档请查看 [API.md](./API.md)

## 主要功能模块
- 认证模块（管理员登录、微信登录）
- 用户管理（教练、家长、学员）
- 课程管理（课程、班级、排课）
- 课程记录（考勤、打分、成长记录）
- 请假审批
- 财务管理
- 内容管理（轮播图、优惠课程）
- 数据统计
- 小程序专用接口

## 数据库表结构
详细的表结构请查看 [database/schema.sql](./database/schema.sql)
