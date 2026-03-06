const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const getCoaches = async (req, res) => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const whereClause = keyword
      ? 'WHERE nickname LIKE $1 OR phone LIKE $1'
      : '';
    const params = keyword ? [`%${keyword}%`] : [];

    const result = await db.query(
      `SELECT * FROM coaches ${whereClause} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM coaches ${whereClause}`,
      params
    );

    success(res, {
      list: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (err) {
    console.error('获取教练列表错误:', err);
    error(res, '服务器错误');
  }
};

const createCoach = async (req, res) => {
  const { openid, nickname, phone, avatar } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO coaches (openid, nickname, phone, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
      [openid, nickname, phone, avatar]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建教练错误:', err);
    if (err.code === '23505') {
      error(res, '该openid已存在');
    } else {
      error(res, '服务器错误');
    }
  }
};

const updateCoach = async (req, res) => {
  const { id } = req.params;
  const { nickname, phone, avatar } = req.body;

  try {
    const result = await db.query(
      'UPDATE coaches SET nickname = COALESCE($2, nickname), phone = COALESCE($3, phone), avatar = COALESCE($4, avatar), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, nickname, phone, avatar]
    );

    if (result.rows.length === 0) {
      return notFound(res, '教练不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新教练错误:', err);
    error(res, '服务器错误');
  }
};

const deleteCoach = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM coaches WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '教练不存在');
    }

    success(res, null, '删除成功');
  } catch (err) {
    console.error('删除教练错误:', err);
    error(res, '服务器错误');
  }
};

const getCoachStats = async (req, res) => {
  const { id } = req.params;

  try {
    const classCount = await db.query(
      'SELECT COUNT(*) as count FROM classes WHERE coach_id = $1',
      [id]
    );

    const recordCount = await db.query(
      'SELECT COUNT(*) as count FROM class_records WHERE coach_id = $1',
      [id]
    );

    const studentCount = await db.query(
      `SELECT COUNT(DISTINCT sc.student_id) as count 
       FROM student_class sc 
       JOIN classes c ON sc.class_id = c.id 
       WHERE c.coach_id = $1`,
      [id]
    );

    success(res, {
      classCount: parseInt(classCount.rows[0].count),
      recordCount: parseInt(recordCount.rows[0].count),
      studentCount: parseInt(studentCount.rows[0].count)
    });
  } catch (err) {
    console.error('获取教练统计错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  getCoachStats
};
