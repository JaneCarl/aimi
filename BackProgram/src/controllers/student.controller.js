const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const getStudents = async (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', classId } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    let whereClause = keyword ? 'WHERE s.name LIKE $1 OR s.id::text LIKE $1' : '';
    let params = keyword ? [`%${keyword}%`] : [];

    if (classId) {
      const paramIndex = params.length + 1;
      whereClause = whereClause
        ? whereClause + ` AND s.id IN (SELECT student_id FROM student_class WHERE class_id = $${paramIndex})`
        : `WHERE s.id IN (SELECT student_id FROM student_class WHERE class_id = $${paramIndex})`;
      params.push(classId);
    }

    const result = await db.query(
      `SELECT s.*, 
              json_agg(DISTINCT jsonb_build_object('id', p.id, 'nickname', p.nickname)) as parents
       FROM students s
       LEFT JOIN parent_student ps ON s.id = ps.student_id
       LEFT JOIN parents p ON ps.parent_id = p.id
       ${whereClause}
       GROUP BY s.id
       ORDER BY s.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(DISTINCT s.id) FROM students s ${whereClause}`,
      params
    );

    success(res, {
      list: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (err) {
    console.error('获取学员列表错误:', err);
    error(res, '服务器错误');
  }
};

const createStudent = async (req, res) => {
  const { name, birth_date, photo, remaining_hours = 0 } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO students (name, birth_date, photo, remaining_hours) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, birth_date, photo, remaining_hours]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建学员错误:', err);
    error(res, '服务器错误');
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, birth_date, photo, remaining_hours, points } = req.body;

  try {
    const result = await db.query(
      `UPDATE students 
       SET name = COALESCE($2, name),
           birth_date = COALESCE($3, birth_date),
           photo = COALESCE($4, photo),
           remaining_hours = COALESCE($5, remaining_hours),
           points = COALESCE($6, points),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id, name, birth_date, photo, remaining_hours, points]
    );

    if (result.rows.length === 0) {
      return notFound(res, '学员不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新学员错误:', err);
    error(res, '服务器错误');
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM students WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '学员不存在');
    }

    success(res, null, '删除成功');
  } catch (err) {
    console.error('删除学员错误:', err);
    error(res, '服务器错误');
  }
};

const bindParent = async (req, res) => {
  const { id } = req.params;
  const { parent_id } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO parent_student (parent_id, student_id) VALUES ($1, $2) ON CONFLICT (parent_id, student_id) DO NOTHING RETURNING *',
      [parent_id, id]
    );

    success(res, null, '绑定成功');
  } catch (err) {
    console.error('绑定家长错误:', err);
    error(res, '服务器错误');
  }
};

const unbindParent = async (req, res) => {
  const { id, parentId } = req.params;

  try {
    await db.query(
      'DELETE FROM parent_student WHERE parent_id = $1 AND student_id = $2',
      [parentId, id]
    );

    success(res, null, '解绑成功');
  } catch (err) {
    console.error('解绑家长错误:', err);
    error(res, '服务器错误');
  }
};

const assignClass = async (req, res) => {
  const { id } = req.params;
  const { class_id } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO student_class (student_id, class_id) VALUES ($1, $2) ON CONFLICT (student_id, class_id) DO NOTHING RETURNING *',
      [id, class_id]
    );

    success(res, null, '分班成功');
  } catch (err) {
    console.error('分班错误:', err);
    error(res, '服务器错误');
  }
};

const getStudentDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const studentResult = await db.query(
      `SELECT s.*, 
              json_agg(DISTINCT jsonb_build_object('id', p.id, 'nickname', p.nickname)) as parents,
              json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name)) as classes
       FROM students s
       LEFT JOIN parent_student ps ON s.id = ps.student_id
       LEFT JOIN parents p ON ps.parent_id = p.id
       LEFT JOIN student_class sc ON s.id = sc.student_id
       LEFT JOIN classes c ON sc.class_id = c.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [id]
    );

    if (studentResult.rows.length === 0) {
      return notFound(res, '学员不存在');
    }

    success(res, studentResult.rows[0]);
  } catch (err) {
    console.error('获取学员详情错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  bindParent,
  unbindParent,
  assignClass,
  getStudentDetail
};
