-- 艾米格斗少儿培训机构 - 数据库表设计
-- 数据库：PostgreSQL

-- 1. 管理员表
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 教练表
CREATE TABLE coaches (
    id SERIAL PRIMARY KEY,
    openid VARCHAR(100) UNIQUE NOT NULL,
    nickname VARCHAR(50),
    avatar TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 课程表
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 班级表
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    capacity INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 家长表
CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    openid VARCHAR(100) UNIQUE NOT NULL,
    nickname VARCHAR(50),
    avatar TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 学员表
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    photo TEXT,
    remaining_hours INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 家长-学员关联表（一个家长可有多个孩子，一个孩子可有多个家长）
CREATE TABLE parent_student (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    relation VARCHAR(20) DEFAULT 'parent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_id, student_id)
);

-- 8. 学员-班级关联表
CREATE TABLE student_class (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    join_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, class_id)
);

-- 9. 排课表
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE SET NULL,
    classroom VARCHAR(50),
    weekday INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. 课程记录表（实际上课记录）
CREATE TABLE class_records (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE SET NULL,
    class_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending: 未开始, ongoing: 进行中, completed: 已完成
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. 学员考勤表
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES class_records(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- normal: 正常, late: 迟到, leave: 请假, absent: 缺席
    score INTEGER,
    comment TEXT,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. 请假申请表
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
    record_id INTEGER REFERENCES class_records(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending: 待审批, approved: 已批准, rejected: 已拒绝
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. 成长记录表
CREATE TABLE growth_records (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE SET NULL,
    record_id INTEGER REFERENCES class_records(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    media_type VARCHAR(20), -- image, video
    media_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. 课时充值记录表
CREATE TABLE hour_topups (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. 财务记录表（手动录入）
CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- income: 收入, expense: 支出
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    record_date DATE NOT NULL,
    admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. 轮播图表
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    title VARCHAR(100),
    link VARCHAR(255),
    order_num INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. 优惠课程表
CREATE TABLE promotional_courses (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    original_price DECIMAL(10, 2),
    promotional_price DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. 消息通知表
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- all: 全员, coach: 教练, parent: 家长, specific: 特定用户
    target_id INTEGER,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. 积分发放记录表
CREATE TABLE point_records (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT,
    attendance_id INTEGER REFERENCES attendance(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_coaches_openid ON coaches(openid);
CREATE INDEX idx_parents_openid ON parents(openid);
CREATE INDEX idx_schedules_class_id ON schedules(class_id);
CREATE INDEX idx_class_records_class_date ON class_records(class_date);
CREATE INDEX idx_attendance_record_id ON attendance(record_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_growth_records_student_id ON growth_records(student_id);
CREATE INDEX idx_leave_requests_student_id ON leave_requests(student_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_financial_records_date ON financial_records(record_date);

-- 插入初始管理员账号（密码: admin123，需要用bcrypt加密）
-- INSERT INTO admins (username, password, name) VALUES ('admin', '$2b$10$...', '系统管理员');
