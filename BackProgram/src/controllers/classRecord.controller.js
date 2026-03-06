const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const getClassRecords = async (req, res) => {
  const { classId, coachId, date } = req.query;

  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (classId) {
      whereClause += ` AND cr.class_id = $${paramIndex++}`;
      params.push(classId);
    }

    if (coachId) {
      whereClause += ` AND cr.coach_id = $${paramIndex++}`;
      params.push(coachId);
    }

    if (date) {
      whereClause += ` AND cr.class_date = $${paramIndex++}`;
      params.push(date);
    }

    const result = await db.query(
      `SELECT cr.*, c.name as class_name, coach.nickname as coach_name
       FROM class_records cr
       LEFT JOIN classes c ON cr.class_id = c.id
       LEFT JOIN coaches coach ON cr.coach_id = coach.id
       ${whereClause}
       ORDER BY cr.class_date DESC, cr.start_time ASC`,
      params
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取课程记录错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachTodayClasses = async (req, res) => {
  const { coachId } = req.user;

  try {
    const result = await db.query(
      `SELECT cr.*, c.name as class_name, count(a.id) as attendance_count
       FROM class_records cr
       JOIN classes c ON cr.class_id = c.id
       LEFT JOIN attendance a ON cr.id = a.record_id
       WHERE cr.coach_id = $1 AND cr.class_date = CURRENT_DATE
       GROUP BY cr.id, c.name
       ORDER BY cr.start_time ASC`,
      [coachId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取今日课程错误:', err);
    error(res, '服务器错误');
  }
};

const getClassRecordDetail = async (req, res) => {
  const { recordId } = req.params;

  try {
    const recordResult = await db.query(
      `SELECT cr.*, c.name as class_name, coach.nickname as coach_name
       FROM class_records cr
       JOIN classes c ON cr.class_id = c.id
       LEFT JOIN coaches coach ON cr.coach_id = coach.id
       WHERE cr.id = $1`,
      [recordId]
    );

    if (recordResult.rows.length === 0) {
      return notFound(res, '课程记录不存在');
    }

    const attendanceResult = await db.query(
      `SELECT a.*, s.name as student_name, s.photo
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       WHERE a.record_id = $1`,
      [recordId]
    );

    const record = recordResult.rows[0];
    record.attendance = attendanceResult.rows;

    success(res, record);
  } catch (err) {
    console.error('获取课程记录详情错误:', err);
    error(res, '服务器错误');
  }
};

const updateClassRecordStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.query(
      'UPDATE class_records SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, status]
    );

    if (result.rows.length === 0) {
      return notFound(res, '课程记录不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新课程状态错误:', err);
    error(res, '服务器错误');
  }
};

const batchCheckin = async (req, res) => {
  const { record_id, attendance } = req.body;

  try {
    for (const item of attendance) {
      await db.query(
        `INSERT INTO attendance (record_id, student_id, status) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (record_id, student_id) 
         DO UPDATE SET status = $3, updated_at = CURRENT_TIMESTAMP`,
        [record_id, item.student_id, item.status]
      );
    }

    success(res, null, '签到成功');
  } catch (err) {
    console.error('批量签到错误:', err);
    error(res, '服务器错误');
  }
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { score, comment, points_awarded } = req.body;

  try {
    const result = await db.query(
      'UPDATE attendance SET score = COALESCE($2, score), comment = COALESCE($3, comment), points_awarded = COALESCE($4, points_awarded), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, score, comment, points_awarded]
    );

    if (result.rows.length === 0) {
      return notFound(res, '考勤记录不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新考勤错误:', err);
    error(res, '服务器错误');
  }
};

const createGrowthRecord = async (req, res) => {
  const { student_id, coach_id, record_id, comment, media_type, media_url } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO growth_records (student_id, coach_id, record_id, comment, media_type, media_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [student_id, coach_id, record_id, comment, media_type, media_url]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建成长记录错误:', err);
    error(res, '服务器错误');
  }
};

const getStudentGrowthRecords = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      `SELECT gr.*, s.name as student_name, coach.nickname as coach_name, cr.class_date
       FROM growth_records gr
       JOIN students s ON gr.student_id = s.id
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

const getClassAttendance = async (req, res) => {
  const { recordId } = req.params;

  try {
    const result = await db.query(
      `SELECT a.*, s.name as student_name, s.photo
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       WHERE a.record_id = $1`,
      [recordId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取课程考勤错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getClassRecords,
  getCoachTodayClasses,
  getClassRecordDetail,
  updateClassRecordStatus,
  batchCheckin,
  updateAttendance,
  createGrowthRecord,
  getStudentGrowthRecords,
  getClassAttendance
};
