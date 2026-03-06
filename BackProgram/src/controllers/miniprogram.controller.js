const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

// 家长端接口
const getParentHome = async (req, res) => {
  const { parentId } = req.user;

  try {
    const bannersResult = await db.query(
      "SELECT * FROM banners WHERE status = 'active' ORDER BY order_num ASC"
    );

    const promotionalResult = await db.query(
      `SELECT pc.*, c.name as course_name
       FROM promotional_courses pc
       LEFT JOIN courses c ON pc.course_id = c.id
       WHERE pc.status = 'active'
       ORDER BY pc.created_at DESC`
    );

    const studentsResult = await db.query(
      `SELECT s.* FROM students s
       JOIN parent_student ps ON s.id = ps.student_id
       WHERE ps.parent_id = $1
       LIMIT 1`,
      [parentId]
    );

    let nextClass = null;
    let studentPhoto = null;

    if (studentsResult.rows.length > 0) {
      const student = studentsResult.rows[0];
      studentPhoto = student.photo;

      const nextClassResult = await db.query(
        `SELECT cr.*, c.name as class_name, coach.nickname as coach_name
         FROM class_records cr
         JOIN classes c ON cr.class_id = c.id
         LEFT JOIN coaches coach ON cr.coach_id = coach.id
         JOIN student_class sc ON c.id = sc.class_id
         WHERE sc.student_id = $1 AND cr.class_date >= CURRENT_DATE AND cr.status = 'pending'
         ORDER BY cr.class_date ASC, cr.start_time ASC
         LIMIT 1`,
        [student.id]
      );

      if (nextClassResult.rows.length > 0) {
        nextClass = nextClassResult.rows[0];
      }
    }

    success(res, {
      banners: bannersResult.rows,
      nextClass,
      promotionalCourses: promotionalResult.rows,
      studentPhoto
    });
  } catch (err) {
    console.error('获取家长首页错误:', err);
    error(res, '服务器错误');
  }
};

const getParentStudents = async (req, res) => {
  const { parentId } = req.user;

  try {
    const result = await db.query(
      `SELECT s.*, sc.class_id, c.name as class_name
       FROM students s
       JOIN parent_student ps ON s.id = ps.student_id
       LEFT JOIN student_class sc ON s.id = sc.student_id
       LEFT JOIN classes c ON sc.class_id = c.id
       WHERE ps.parent_id = $1
       ORDER BY s.created_at DESC`,
      [parentId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取家长孩子列表错误:', err);
    error(res, '服务器错误');
  }
};

const getParentSchedule = async (req, res) => {
  const { studentId } = req.params;
  const { month } = req.query;

  try {
    const monthCondition = month ? `DATE_TRUNC('month', cr.class_date) = '${month}-01'::date` : `DATE_TRUNC('month', cr.class_date) = DATE_TRUNC('month', CURRENT_DATE)`;

    const result = await db.query(
      `SELECT cr.*, c.name as class_name, coach.nickname as coach_name, a.status as attendance_status, a.id as attendance_id
       FROM class_records cr
       JOIN classes c ON cr.class_id = c.id
       LEFT JOIN coaches coach ON cr.coach_id = coach.id
       LEFT JOIN student_class sc ON c.id = sc.class_id
       LEFT JOIN attendance a ON cr.id = a.record_id AND a.student_id = $1
       WHERE sc.student_id = $1 AND ${monthCondition}
       ORDER BY cr.class_date ASC, cr.start_time ASC`,
      [studentId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取学员课表错误:', err);
    error(res, '服务器错误');
  }
};

const getParentGrowth = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      `SELECT gr.*, coach.nickname as coach_name, cr.class_date
       FROM growth_records gr
       LEFT JOIN coaches coach ON gr.coach_id = coach.id
       LEFT JOIN class_records cr ON gr.record_id = cr.id
       WHERE gr.student_id = $1
       ORDER BY gr.created_at DESC`,
      [studentId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取成长记录错误:', err);
    error(res, '服务器错误');
  }
};

const getParentStudentDetail = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM students WHERE id = $1',
      [studentId]
    );

    if (result.rows.length === 0) {
      return notFound(res, '学员不存在');
    }

    success(res, result.rows[0]);
  } catch (err) {
    console.error('获取学员详情错误:', err);
    error(res, '服务器错误');
  }
};

const getParentHourHistory = async (req, res) => {
  const { studentId } = req.params;

  try {
    const topupResult = await db.query(
      `SELECT ht.*, a.name as admin_name
       FROM hour_topups ht
       LEFT JOIN admins a ON ht.admin_id = a.id
       WHERE ht.student_id = $1
       ORDER BY ht.created_at DESC`,
      [studentId]
    );

    const classRecordsResult = await db.query(
      `SELECT cr.*, a.status as attendance_status
       FROM class_records cr
       JOIN classes c ON cr.class_id = c.id
       JOIN student_class sc ON c.id = sc.class_id
       LEFT JOIN attendance a ON cr.id = a.record_id AND a.student_id = $1
       WHERE sc.student_id = $1 AND cr.status = 'completed'
       ORDER BY cr.class_date DESC`,
      [studentId]
    );

    success(res, {
      topups: topupResult.rows,
      classRecords: classRecordsResult.rows
    });
  } catch (err) {
    console.error('获取课消明细错误:', err);
    error(res, '服务器错误');
  }
};

// 教练端接口
const getCoachHome = async (req, res) => {
  const { coachId } = req.user;

  try {
    const bannersResult = await db.query(
      "SELECT * FROM banners WHERE status = 'active' ORDER BY order_num ASC"
    );

    const todayResult = await db.query(
      `SELECT COUNT(*) as count
       FROM class_records
       WHERE coach_id = $1 AND class_date = CURRENT_DATE AND status != 'completed'`,
      [coachId]
    );

    const coachResult = await db.query(
      'SELECT * FROM coaches WHERE id = $1',
      [coachId]
    );

    success(res, {
      banners: bannersResult.rows,
      todayCount: parseInt(todayResult.rows[0].count),
      coach: coachResult.rows[0]
    });
  } catch (err) {
    console.error('获取教练首页错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachTodayClasses = async (req, res) => {
  const { coachId } = req.user;

  try {
    const result = await db.query(
      `SELECT cr.*, c.name as class_name
       FROM class_records cr
       JOIN classes c ON cr.class_id = c.id
       WHERE cr.coach_id = $1 AND cr.class_date = CURRENT_DATE
       ORDER BY cr.start_time ASC`,
      [coachId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取教练今日课程错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachClassDetail = async (req, res) => {
  const { recordId } = req.params;

  try {
    const recordResult = await db.query(
      `SELECT cr.*, c.name as class_name
       FROM class_records cr
       JOIN classes c ON cr.class_id = c.id
       WHERE cr.id = $1`,
      [recordId]
    );

    if (recordResult.rows.length === 0) {
      return notFound(res, '课程记录不存在');
    }

    const studentsResult = await db.query(
      `SELECT s.*, a.id as attendance_id, a.status, a.score, a.comment, a.points_awarded, a.media_type, a.media_url
       FROM student_class sc
       JOIN students s ON sc.student_id = s.id
       LEFT JOIN attendance a ON a.record_id = $1 AND a.student_id = s.id
       WHERE sc.class_id = $2
       ORDER BY s.name ASC`,
      [recordId, recordResult.rows[0].class_id]
    );

    const record = recordResult.rows[0];
    record.students = studentsResult.rows;

    success(res, record);
  } catch (err) {
    console.error('获取课程详情错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachStudents = async (req, res) => {
  const { coachId } = req.user;

  try {
    const result = await db.query(
      `SELECT DISTINCT s.* FROM students s
       JOIN student_class sc ON s.id = sc.student_id
       JOIN classes c ON sc.class_id = c.id
       WHERE c.coach_id = $1
       ORDER BY s.name ASC`,
      [coachId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取教练学生列表错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachStudentDetail = async (req, res) => {
  const { studentId } = req.params;

  try {
    const studentResult = await db.query(
      'SELECT * FROM students WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return notFound(res, '学员不存在');
    }

    const recordsResult = await db.query(
      `SELECT cr.*, c.name as class_name, a.status, a.score, a.points_awarded
       FROM class_records cr
       JOIN classes c ON cr.class_id = c.id
       LEFT JOIN attendance a ON cr.id = a.record_id AND a.student_id = $1
       JOIN student_class sc ON c.id = sc.class_id
       WHERE sc.student_id = $1 AND cr.status = 'completed'
       ORDER BY cr.class_date DESC
       LIMIT 10`,
      [studentId]
    );

    const student = studentResult.rows[0];
    student.recentRecords = recordsResult.rows;

    success(res, student);
  } catch (err) {
    console.error('获取学员详情错误:', err);
    error(res, '服务器错误');
  }
};

const submitClassAttendance = async (req, res) => {
  const { recordId } = req.params;
  const { attendance } = req.body;

  try {
    await db.query('BEGIN');

    for (const item of attendance) {
      const existingResult = await db.query(
        'SELECT id FROM attendance WHERE record_id = $1 AND student_id = $2',
        [recordId, item.student_id]
      );

      if (existingResult.rows.length > 0) {
        await db.query(
          'UPDATE attendance SET status = $3, score = COALESCE($4, score), comment = COALESCE($5, comment), points_awarded = COALESCE($6, points_awarded), media_type = COALESCE($7, media_type), media_url = COALESCE($8, media_url), updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [existingResult.rows[0].id, item.student_id, item.status, item.score, item.comment, item.points_awarded, item.media_type, item.media_url]
        );

        if (item.points_awarded > 0) {
          await db.query(
            'UPDATE students SET points = points + $1 WHERE id = $2',
            [item.points_awarded, item.student_id]
          );

          await db.query(
            'INSERT INTO point_records (student_id, amount, reason, attendance_id) VALUES ($1, $2, $3, $4)',
            [item.student_id, item.points_awarded, '课堂表现奖励', existingResult.rows[0].id]
          );
        }
      } else {
        const newResult = await db.query(
          'INSERT INTO attendance (record_id, student_id, status, score, comment, points_awarded, media_type, media_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
          [recordId, item.student_id, item.status, item.score, item.comment, item.points_awarded, item.media_type, item.media_url]
        );

        if (item.points_awarded > 0) {
          await db.query(
            'UPDATE students SET points = points + $1 WHERE id = $2',
            [item.points_awarded, item.student_id]
          );

          await db.query(
            'INSERT INTO point_records (student_id, amount, reason, attendance_id) VALUES ($1, $2, $3, $4)',
            [item.student_id, item.points_awarded, '课堂表现奖励', newResult.rows[0].id]
          );
        }
      }

      if (item.comment && item.comment.trim()) {
        await db.query(
          'INSERT INTO growth_records (student_id, coach_id, record_id, comment, media_type, media_url) VALUES ($1, $2, $3, $4, $5, $6)',
          [item.student_id, req.user.coachId, recordId, item.comment, item.media_type, item.media_url]
        );
      }
    }

    await db.query('COMMIT');

    success(res, null, '提交成功');
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('提交考勤错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachStats = async (req, res) => {
  const { coachId } = req.user;

  try {
    const classCount = await db.query(
      'SELECT COUNT(*) as count FROM classes WHERE coach_id = $1',
      [coachId]
    );

    const recordCount = await db.query(
      'SELECT COUNT(*) as count FROM class_records WHERE coach_id = $1',
      [coachId]
    );

    const studentCount = await db.query(
      `SELECT COUNT(DISTINCT sc.student_id) as count
       FROM student_class sc
       JOIN classes c ON sc.class_id = c.id
       WHERE c.coach_id = $1`,
      [coachId]
    );

    const avgScoreResult = await db.query(
      `SELECT AVG(score) as avg_score
       FROM attendance a
       JOIN class_records cr ON a.record_id = cr.id
       WHERE cr.coach_id = $1 AND a.score IS NOT NULL`,
      [coachId]
    );

    success(res, {
      classCount: parseInt(classCount.rows[0].count),
      recordCount: parseInt(recordCount.rows[0].count),
      studentCount: parseInt(studentCount.rows[0].count),
      avgScore: parseFloat(avgScoreResult.rows[0].avg_score || 0).toFixed(2)
    });
  } catch (err) {
    console.error('获取教练统计错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getParentHome,
  getParentStudents,
  getParentSchedule,
  getParentGrowth,
  getParentStudentDetail,
  getParentHourHistory,
  getCoachHome,
  getCoachTodayClasses,
  getCoachClassDetail,
  getCoachStudents,
  getCoachStudentDetail,
  submitClassAttendance,
  getCoachStats
};
