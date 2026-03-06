# 艾米格斗少儿培训机构 - 后台API接口文档

## 基础信息
- 基础URL: `http://localhost:3000/api`
- 响应格式: JSON
- 认证方式: JWT Token

## 通用响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

---

## 一、认证模块

### 1.1 管理员登录
- **路径**: `/auth/admin/login`
- **方法**: POST
- **请求体**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin",
      "name": "系统管理员"
    }
  }
}
```

### 1.2 教练/家长微信登录
- **路径**: `/auth/wechat/login`
- **方法**: POST
- **请求体**:
```json
{
  "openid": "oKxxxxxx",
  "role": "coach", // coach 或 parent
  "nickname": "教练名称"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "nickname": "教练名称",
      "avatar": ""
    }
  }
}
```

---

## 二、用户管理模块

### 2.1 教练管理

#### 获取教练列表
- **路径**: `/coaches`
- **方法**: GET
- **参数**: `page`, `pageSize`, `keyword`
- **响应**:
```json
{
  "code": 200,
  "data": {
    "list": [...],
    "total": 10,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 创建教练
- **路径**: `/coaches`
- **方法**: POST
- **请求体**:
```json
{
  "openid": "oKxxxxxx",
  "nickname": "张教练",
  "phone": "13800138000"
}
```

#### 更新教练
- **路径**: `/coaches/:id`
- **方法**: PUT

#### 删除教练
- **路径**: `/coaches/:id`
- **方法**: DELETE

#### 获取教练教学统计
- **路径**: `/coaches/:id/stats`
- **方法**: GET

### 2.2 家长管理

#### 获取家长列表
- **路径**: `/parents`
- **方法**: GET

#### 获取家长详情及关联学员
- **路径**: `/parents/:id`
- **方法**: GET

### 2.3 学员管理

#### 获取学员列表
- **路径**: `/students`
- **方法**: GET
- **参数**: `page`, `pageSize`, `keyword`, `classId`

#### 创建学员
- **路径**: `/students`
- **方法**: POST
- **请求体**:
```json
{
  "name": "小明",
  "birth_date": "2018-01-01",
  "photo": "",
  "remaining_hours": 10
}
```

#### 更新学员
- **路径**: `/students/:id`
- **方法**: PUT

#### 删除学员
- **路径**: `/students/:id`
- **方法**: DELETE

#### 绑定家长
- **路径**: `/students/:id/bind-parent`
- **方法**: POST
- **请求体**:
```json
{
  "parent_id": 1
}
```

#### 解绑家长
- **路径**: `/students/:id/unbind-parent/:parentId`
- **方法**: DELETE

#### 给学员分班
- **路径**: `/students/:id/assign-class`
- **方法**: POST
- **请求体**:
```json
{
  "class_id": 1
}
```

---

## 三、课程管理模块

### 3.1 课程体系管理

#### 获取课程列表
- **路径**: `/courses`
- **方法**: GET

#### 创建课程
- **路径**: `/courses`
- **方法**: POST
- **请求体**:
```json
{
  "name": "初级泰拳课",
  "level": "初级",
  "description": "适合5-8岁儿童"
}
```

#### 更新课程
- **路径**: `/courses/:id`
- **方法**: PUT

#### 删除课程
- **路径**: `/courses/:id`
- **方法**: DELETE

### 3.2 班级管理

#### 获取班级列表
- **路径**: `/classes`
- **方法**: GET
- **参数**: `courseId`, `coachId`

#### 创建班级
- **路径**: `/classes`
- **方法**: POST
- **请求体**:
```json
{
  "course_id": 1,
  "coach_id": 1,
  "name": "泰拳初级班A",
  "capacity": 10
}
```

#### 更新班级
- **路径**: `/classes/:id`
- **方法**: PUT

#### 删除班级
- **路径**: `/classes/:id`
- **方法**: DELETE

#### 获取班级学员列表
- **路径**: `/classes/:id/students`
- **方法**: GET

### 3.3 排课管理

#### 获取排课列表
- **路径**: `/schedules`
- **方法**: GET
- **参数**: `classId`, `coachId`

#### 创建排课
- **路径**: `/schedules`
- **方法**: POST
- **请求体**:
```json
{
  "class_id": 1,
  "coach_id": 1,
  "classroom": "训练室A",
  "weekday": 1,
  "start_time": "18:00",
  "end_time": "19:00"
}
```

#### 更新排课
- **路径**: `/schedules/:id`
- **方法**: PUT

#### 删除排课
- **路径**: `/schedules/:id`
- **方法**: DELETE

---

## 四、课程记录模块

### 4.1 课程记录

#### 获取课程记录
- **路径**: `/class-records`
- **方法**: GET
- **参数**: `classId`, `coachId`, `date`

#### 获取教练今日课程
- **路径**: `/class-records/coach/today`
- **方法**: GET

#### 创建课程记录
- **路径**: `/class-records`
- **方法**: POST
- **请求体**:
```json
{
  "schedule_id": 1,
  "class_id": 1,
  "coach_id": 1,
  "class_date": "2026-03-05",
  "start_time": "18:00",
  "end_time": "19:00"
}
```

#### 更新课程状态
- **路径**: `/class-records/:id/status`
- **方法**: PUT
- **请求体**:
```json
{
  "status": "ongoing" // pending, ongoing, completed
}
```

### 4.2 考勤管理

#### 获取课程学员考勤
- **路径**: `/attendance/record/:recordId`
- **方法**: GET

#### 批量签到
- **路径**: `/attendance/batch-checkin`
- **方法**: POST
- **请求体**:
```json
{
  "record_id": 1,
  "attendance": [
    {
      "student_id": 1,
      "status": "normal"
    },
    {
      "student_id": 2,
      "status": "late"
    }
  ]
}
```

#### 更新考勤信息
- **路径**: `/attendance/:id`
- **方法**: PUT
- **请求体**:
```json
{
  "score": 85,
  "comment": "表现优秀",
  "points_awarded": 10
}
```

---

## 五、请假审批模块

### 5.1 请假申请

#### 提交请假申请
- **路径**: `/leave-requests`
- **方法**: POST
- **请求体**:
```json
{
  "student_id": 1,
  "record_id": 1,
  "reason": "孩子生病"
}
```

#### 获取学员请假列表
- **路径**: `/leave-requests/student/:studentId`
- **方法**: GET

#### 获取待审批请假列表（管理员）
- **路径**: `/leave-requests/pending`
- **方法**: GET

#### 审批请假
- **路径**: `/leave-requests/:id/approve`
- **方法**: PUT
- **请求体**:
```json
{
  "status": "approved", // approved 或 rejected
  "admin_id": 1
}
```

---

## 六、积分管理模块

### 6.1 积分记录

#### 获取积分发放记录
- **路径**: `/point-records`
- **方法**: GET
- **参数**: `studentId`, `page`, `pageSize`

#### 手动发放积分
- **路径**: `/point-records`
- **方法**: POST
- **请求体**:
```json
{
  "student_id": 1,
  "amount": 20,
  "reason": "优秀表现奖励"
}
```

---

## 七、课消与财务模块

### 7.1 课时管理

#### 获取学员课时信息
- **路径**: `/students/:id/hours`
- **方法**: GET

#### 课时充值
- **路径**: `/hour-topups`
- **方法**: POST
- **请求体**:
```json
{
  "student_id": 1,
  "amount": 10,
  "admin_id": 1
}
```

#### 获取充值记录
- **路径**: `/hour-topups`
- **方法**: GET
- **参数**: `studentId`, `page`, `pageSize`

### 7.2 财务记录

#### 添加财务记录
- **路径**: `/financial-records`
- **方法**: POST
- **请求体**:
```json
{
  "type": "income",
  "amount": 1000.00,
  "category": "课时费",
  "description": "学员充值",
  "record_date": "2026-03-05",
  "admin_id": 1
}
```

#### 获取财务记录
- **路径**: `/financial-records`
- **方法**: GET
- **参数**: `type`, `startDate`, `endDate`, `page`, `pageSize`

#### 获取财务统计报表
- **路径**: `/financial-records/stats`
- **方法**: GET
- **参数**: `period` (day, month, year)

---

## 八、内容管理模块

### 8.1 轮播图管理

#### 获取轮播图列表
- **路径**: `/banners`
- **方法**: GET

#### 创建轮播图
- **路径**: `/banners`
- **方法**: POST
- **请求体**:
```json
{
  "image": "https://example.com/image.jpg",
  "title": "春季特惠活动",
  "link": "",
  "order_num": 1
}
```

#### 更新轮播图
- **路径**: `/banners/:id`
- **方法**: PUT

#### 删除轮播图
- **路径**: `/banners/:id`
- **方法**: DELETE

### 8.2 优惠课程管理

#### 获取优惠课程列表
- **路径**: `/promotional-courses`
- **方法**: GET

#### 创建优惠课程
- **路径**: `/promotional-courses`
- **方法**: POST
- **请求体**:
```json
{
  "course_id": 1,
  "title": "春季特惠 - 初级泰拳课",
  "description": "限时优惠",
  "original_price": 2000,
  "promotional_price": 1500,
  "start_date": "2026-03-01",
  "end_date": "2026-03-31"
}
```

#### 更新优惠课程
- **路径**: `/promotional-courses/:id`
- **方法**: PUT

#### 删除优惠课程
- **路径**: `/promotional-courses/:id`
- **方法**: DELETE

---

## 九、数据统计模块

### 9.1 出勤统计

#### 获取出勤统计
- **路径**: `/stats/attendance`
- **方法**: GET
- **参数**: `classId`, `startDate`, `endDate`

### 9.2 教学统计

#### 获取教练教学统计
- **路径**: `/stats/coach/:coachId`
- **方法**: GET

### 9.3 业务报表

#### 获取学员增长统计
- **路径**: `/stats/student-growth`
- **方法**: GET
- **参数**: `period` (day, month, year)

#### 获取营收统计
- **路径**: `/stats/revenue`
- **方法**: GET
- **参数**: `period` (day, month, year)

---

## 十、消息通知模块

### 10.1 通知管理

#### 发送通知
- **路径**: `/notifications`
- **方法**: POST
- **请求体**:
```json
{
  "title": "放假通知",
  "content": "本周五正常上课",
  "target_type": "all"
}
```

#### 获取通知列表
- **路径**: `/notifications`
- **方法**: GET

---

## 十一、成长记录模块

### 11.1 成长记录

#### 创建成长记录
- **路径**: `/growth-records`
- **方法**: POST
- **请求体**:
```json
{
  "student_id": 1,
  "coach_id": 1,
  "record_id": 1,
  "comment": "今天表现很好，动作很标准",
  "media_type": "image",
  "media_url": "https://example.com/image.jpg"
}
```

#### 获取学员成长记录
- **路径**: `/growth-records/student/:studentId`
- **方法**: GET

---

## 十二、小程序专用接口

### 12.1 家长端

#### 获取家长的孩子列表
- **路径**: `/miniprogram/parent/students`
- **方法**: GET

#### 获取首页数据
- **路径**: `/miniprogram/parent/home`
- **方法**: GET
- **响应**:
```json
{
  "code": 200,
  "data": {
    "banners": [...],
    "nextClass": {...},
    "promotionalCourses": [...],
    "studentPhoto": "..."
  }
}
```

#### 获取学员课表
- **路径**: `/miniprogram/parent/schedule/:studentId`
- **方法**: GET
- **参数**: `month` (YYYY-MM)

#### 获取学员成长记录
- **路径**: `/miniprogram/parent/growth/:studentId`
- **方法**: GET

#### 获取学员详情
- **路径**: `/miniprogram/parent/student/:studentId`
- **方法**: GET

#### 获取学员课消明细
- **路径**: `/miniprogram/parent/hour-history/:studentId`
- **方法**: GET

### 12.2 教练端

#### 获取首页数据
- **路径**: `/miniprogram/coach/home`
- **方法**: GET

#### 获取今日课程列表
- **路径**: `/miniprogram/coach/today-classes`
- **方法**: GET

#### 获取课程详情
- **路径**: `/miniprogram/coach/class-record/:recordId`
- **方法**: GET

#### 获取所有学生列表
- **路径**: `/miniprogram/coach/students`
- **方法**: GET

#### 获取学生详情
- **路径**: `/miniprogram/coach/student/:studentId`
- **方法**: GET

#### 上传课堂记录（签到、打分、评价、媒体）
- **路径**: `/miniprogram/coach/class-record/:recordId/attendance`
- **方法**: POST
- **请求体**:
```json
{
  "attendance": [
    {
      "student_id": 1,
      "status": "normal",
      "score": 85,
      "comment": "表现优秀",
      "points_awarded": 10,
      "media_type": "image",
      "media_url": "https://example.com/image.jpg"
    }
  ]
}
```

#### 获取教练教学统计
- **路径**: `/miniprogram/coach/stats`
- **方法**: GET

#### 获取消息通知
- **路径**: `/miniprogram/coach/notifications`
- **方法**: GET
