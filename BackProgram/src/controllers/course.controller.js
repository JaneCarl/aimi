const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const getCourses = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM courses ORDER BY created_at DESC'
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取课程列表错误:', err);
    error(res, '服务器错误');
  }
};

const createCourse = async (req, res) => {
  const { name, level, description } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO courses (name, level, description) VALUES ($1, $2, $3) RETURNING *',
      [name, level, description]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建课程错误:', err);
    error(res, '服务器错误');
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, level, description } = req.body;

  try {
    const result = await db.query(
      'UPDATE courses SET name = COALESCE($2, name), level = COALESCE($3, level), description = COALESCE($4, description), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, name, level, description]
    );

    if (result.rows.length === 0) {
      return notFound(res, '课程不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新课程错误:', err);
    error(res, '服务器错误');
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM courses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '课程不存在');
    }

    success(res, null, '删除成功');
  } catch (err) {
    console.error('删除课程错误:', err);
    error(res, '服务器错误');
  }
};

const getClasses = async (req, res) => {
  const { courseId, coachId } = req.query;

  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (courseId) {
      whereClause += ` AND course_id = $${paramIndex++}`;
      params.push(courseId);
    }

    if (coachId) {
      whereClause += ` AND coach_id = $${paramIndex++}`;
      params.push(coachId);
    }

    const result = await db.query(
      `SELECT c.*, course.name as course_name, coach.nickname as coach_name
       FROM classes c
       LEFT JOIN courses course ON c.course_id = course.id
       LEFT JOIN coaches coach ON c.coach_id = coach.id
       ${whereClause}
       ORDER BY c.created_at DESC`,
      params
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取班级列表错误:', err);
    error(res, '服务器错误');
  }
};

const createClass = async (req, res) => {
  const { course_id, coach_id, name, capacity = 10 } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO classes (course_id, coach_id, name, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
      [course_id, coach_id, name, capacity]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建班级错误:', err);
    error(res, '服务器错误');
  }
};

const updateClass = async (req, res) => {
  const { id } = req.params;
  const { course_id, coach_id, name, capacity } = req.body;

  try {
    const result = await db.query(
      'UPDATE classes SET course_id = COALESCE($2, course_id), coach_id = COALESCE($3, coach_id), name = COALESCE($4, name), capacity = COALESCE($5, capacity), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, course_id, coach_id, name, capacity]
    );

    if (result.rows.length === 0) {
      return notFound(res, '班级不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新班级错误:', err);
    error(res, '服务器错误');
  }
};

const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM classes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '班级不存在');
    }

    success(res, null, '删除成功');
  } catch (err) {
    console.error('删除班级错误:', err);
    error(res, '服务器错误');
  }
};

const getClassStudents = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT s.*, sc.join_date
       FROM student_class sc
       JOIN students s ON sc.student_id = s.id
       WHERE sc.class_id = $1
       ORDER BY s.created_at DESC`,
      [id]
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取班级学员错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents
};
