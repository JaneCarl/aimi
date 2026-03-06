const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const createLeaveRequest = async (req, res) => {
  const { student_id, record_id, reason } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO leave_requests (student_id, record_id, reason) VALUES ($1, $2, $3) RETURNING *',
      [student_id, record_id, reason]
    );

    success(res, result.rows[0], '提交成功');
  } catch (err) {
    console.error('创建请假申请错误:', err);
    error(res, '服务器错误');
  }
};

const getStudentLeaveRequests = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      `SELECT lr.*, s.name as student_name, c.name as class_name, cr.class_date
       FROM leave_requests lr
       JOIN students s ON lr.student_id = s.id
       LEFT JOIN class_records cr ON lr.record_id = cr.id
       LEFT JOIN classes c ON cr.class_id = c.id
       WHERE lr.student_id = $1
       ORDER BY lr.created_at DESC`,
      [studentId]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取学员请假列表错误:', err);
    error(res, '服务器错误');
  }
};

const getPendingLeaveRequests = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT lr.*, s.name as student_name, p.nickname as parent_nickname
       FROM leave_requests lr
       JOIN students s ON lr.student_id = s.id
       LEFT JOIN parents p ON lr.parent_id = p.id
       WHERE lr.status = 'pending'
       ORDER BY lr.created_at DESC`
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取待审批请假列表错误:', err);
    error(res, '服务器错误');
  }
};

const approveLeaveRequest = async (req, res) => {
  const { id } = req.params;
  const { status, admin_id } = req.body;

  try {
    const result = await db.query(
      'UPDATE leave_requests SET status = $2, admin_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, status, admin_id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '请假申请不存在');
    }

    success(res, result.rows[0], '审批成功');
  } catch (err) {
    console.error('审批请假申请错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  createLeaveRequest,
  getStudentLeaveRequests,
  getPendingLeaveRequests,
  approveLeaveRequest
};
