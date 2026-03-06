const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const getSchedules = async (req, res) => {
  const { classId, coachId } = req.query;

  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (classId) {
      whereClause += ` AND class_id = $${paramIndex++}`;
      params.push(classId);
    }

    if (coachId) {
      whereClause += ` AND coach_id = $${paramIndex++}`;
      params.push(coachId);
    }

    const result = await db.query(
      `SELECT s.*, c.name as class_name, coach.nickname as coach_name
       FROM schedules s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN coaches coach ON s.coach_id = coach.id
       ${whereClause}
       ORDER BY s.weekday, s.start_time`,
      params
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取排课列表错误:', err);
    error(res, '服务器错误');
  }
};

const createSchedule = async (req, res) => {
  const { class_id, coach_id, classroom, weekday, start_time, end_time } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO schedules (class_id, coach_id, classroom, weekday, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [class_id, coach_id, classroom, weekday, start_time, end_time]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建排课错误:', err);
    error(res, '服务器错误');
  }
};

const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { class_id, coach_id, classroom, weekday, start_time, end_time } = req.body;

  try {
    const result = await db.query(
      `UPDATE schedules 
       SET class_id = COALESCE($2, class_id),
           coach_id = COALESCE($3, coach_id),
           classroom = COALESCE($4, classroom),
           weekday = COALESCE($5, weekday),
           start_time = COALESCE($6, start_time),
           end_time = COALESCE($7, end_time),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id, class_id, coach_id, classroom, weekday, start_time, end_time]
    );

    if (result.rows.length === 0) {
      return notFound(res, '排课不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新排课错误:', err);
    error(res, '服务器错误');
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM schedules WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '排课不存在');
    }

    success(res, null, '删除成功');
  } catch (err) {
    console.error('删除排课错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
