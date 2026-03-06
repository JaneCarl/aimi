const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const getBanners = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM banners WHERE status = 'active' ORDER BY order_num ASC, created_at DESC"
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取轮播图错误:', err);
    error(res, '服务器错误');
  }
};

const createBanner = async (req, res) => {
  const { image, title, link, order_num = 0, status = 'active' } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO banners (image, title, link, order_num, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [image, title, link, order_num, status]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建轮播图错误:', err);
    error(res, '服务器错误');
  }
};

const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { image, title, link, order_num, status } = req.body;

  try {
    const result = await db.query(
      'UPDATE banners SET image = COALESCE($2, image), title = COALESCE($3, title), link = COALESCE($4, link), order_num = COALESCE($5, order_num), status = COALESCE($6, status), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, image, title, link, order_num, status]
    );

    if (result.rows.length === 0) {
      return notFound(res, '轮播图不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新轮播图错误:', err);
    error(res, '服务器错误');
  }
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM banners WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '轮播图不存在');
    }

    success(res, null, '删除成功');
  } catch (err) {
    console.error('删除轮播图错误:', err);
    error(res, '服务器错误');
  }
};

const getPromotionalCourses = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT pc.*, c.name as course_name, c.level
       FROM promotional_courses pc
       LEFT JOIN courses c ON pc.course_id = c.id
       WHERE pc.status = 'active'
       ORDER BY pc.created_at DESC`
    );

    success(res, result.rows);
  } catch (err) {
    console.error('获取优惠课程错误:', err);
    error(res, '服务器错误');
  }
};

const createPromotionalCourse = async (req, res) => {
  const { course_id, title, description, original_price, promotional_price, start_date, end_date, status = 'active' } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO promotional_courses (course_id, title, description, original_price, promotional_price, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [course_id, title, description, original_price, promotional_price, start_date, end_date, status]
    );

    success(res, result.rows[0], '创建成功');
  } catch (err) {
    console.error('创建优惠课程错误:', err);
    error(res, '服务器错误');
  }
};

const updatePromotionalCourse = async (req, res) => {
  const { id } = req.params;
  const { course_id, title, description, original_price, promotional_price, start_date, end_date, status } = req.body;

  try {
    const result = await db.query(
      `UPDATE promotional_courses 
       SET course_id = COALESCE($2, course_id),
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           original_price = COALESCE($5, original_price),
           promotional_price = COALESCE($6, promotional_price),
           start_date = COALESCE($7, start_date),
           end_date = COALESCE($8, end_date),
           status = COALESCE($9, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id, course_id, title, description, original_price, promotional_price, start_date, end_date, status]
    );

    if (result.rows.length === 0) {
      return notFound(res, '优惠课程不存在');
    }

    success(res, result.rows[0], '更新成功');
  } catch (err) {
    console.error('更新优惠课程错误:', err);
    error(res, '服务器错误');
  }
};

const deletePromotionalCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM promotional_courses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFound(res, '优惠课程不存在');
    }

    success(res, null, '删除成功');
  } catch (err) {
    console.error('删除优惠课程错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getPromotionalCourses,
  createPromotionalCourse,
  updatePromotionalCourse,
  deletePromotionalCourse
};
