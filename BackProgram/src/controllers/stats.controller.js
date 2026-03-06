const db = require('../config/database');
const { success, error } = require('../utils/response');

const getAttendanceStats = async (req, res) => {
  const { classId, startDate, endDate } = req.query;

  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (classId) {
      whereClause += ` AND cr.class_id = $${paramIndex++}`;
      params.push(classId);
    }

    if (startDate) {
      whereClause += ` AND cr.class_date >= $${paramIndex++}`;
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ` AND cr.class_date <= $${paramIndex++}`;
      params.push(endDate);
    }

    const result = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN a.status = 'normal' THEN 1 END) as normal_count,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count,
        COUNT(CASE WHEN a.status = 'leave' THEN 1 END) as leave_count,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count
       FROM attendance a
       JOIN class_records cr ON a.record_id = cr.id
       ${whereClause}`,
      params
    );

    success(res, result.rows[0]);
  } catch (err) {
    console.error('获取出勤统计错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachStats = async (req, res) => {
  const { coachId } = req.params;

  try {
    const classCount = await db.query(
      'SELECT COUNT(*) as count FROM classes WHERE coach_id = $1',
      [coachId]
    );

    const recordCount = await db.query(
      'SELECT COUNT(*) as count FROM class_records WHERE coach_id = $1',
      [coachId]
    );

    const attendanceStats = await db.query(
      `SELECT 
        COUNT(*) as total_attendance,
        AVG(score) as avg_score
       FROM attendance a
       JOIN class_records cr ON a.record_id = cr.id
       WHERE cr.coach_id = $1`,
      [coachId]
    );

    success(res, {
      classCount: parseInt(classCount.rows[0].count),
      recordCount: parseInt(recordCount.rows[0].count),
      totalAttendance: parseInt(attendanceStats.rows[0].total_attendance || 0),
      avgScore: parseFloat(attendanceStats.rows[0].avg_score || 0).toFixed(2)
    });
  } catch (err) {
    console.error('获取教练统计错误:', err);
    error(res, '服务器错误');
  }
};

const getStudentGrowth = async (req, res) => {
  const { period } = req.query;
  let dateCondition = '';

  switch (period) {
    case 'day':
      dateCondition = "DATE(created_at) = CURRENT_DATE";
      break;
    case 'month':
      dateCondition = "DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)";
      break;
    case 'year':
      dateCondition = "DATE_TRUNC('year', created_at) = DATE_TRUNC('year', CURRENT_DATE)";
      break;
    default:
      dateCondition = "DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)";
  }

  try {
    const newStudentsResult = await db.query(
      `SELECT COUNT(*) as count FROM students WHERE ${dateCondition}`
    );

    const totalStudentsResult = await db.query(
      'SELECT COUNT(*) as count FROM students'
    );

    const classRecordsResult = await db.query(
      `SELECT COUNT(*) as count FROM class_records WHERE ${dateCondition}`
    );

    success(res, {
      newStudents: parseInt(newStudentsResult.rows[0].count),
      totalStudents: parseInt(totalStudentsResult.rows[0].count),
      classRecords: parseInt(classRecordsResult.rows[0].count)
    });
  } catch (err) {
    console.error('获取学员增长统计错误:', err);
    error(res, '服务器错误');
  }
};

const getRevenueStats = async (req, res) => {
  const { period } = req.query;
  let dateCondition = '';

  switch (period) {
    case 'day':
      dateCondition = "DATE(record_date) = CURRENT_DATE";
      break;
    case 'month':
      dateCondition = "DATE_TRUNC('month', record_date) = DATE_TRUNC('month', CURRENT_DATE)";
      break;
    case 'year':
      dateCondition = "DATE_TRUNC('year', record_date) = DATE_TRUNC('year', CURRENT_DATE)";
      break;
    default:
      dateCondition = "DATE_TRUNC('month', record_date) = DATE_TRUNC('month', CURRENT_DATE)";
  }

  try {
    const result = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as profit
       FROM financial_records
       WHERE ${dateCondition}`
    );

    success(res, result.rows[0]);
  } catch (err) {
    console.error('获取营收统计错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getAttendanceStats,
  getCoachStats,
  getStudentGrowth,
  getRevenueStats
};
