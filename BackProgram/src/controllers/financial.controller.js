const db = require('../config/database');
const { success, error, notFound } = require('../utils/response');

const createFinancialRecord = async (req, res) => {
  const { type, amount, category, description, record_date, admin_id } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO financial_records (type, amount, category, description, record_date, admin_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [type, amount, category, description, record_date, admin_id]
    );

    success(res, result.rows[0], '添加成功');
  } catch (err) {
    console.error('添加财务记录错误:', err);
    error(res, '服务器错误');
  }
};

const getFinancialRecords = async (req, res) => {
  const { type, startDate, endDate, page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (type) {
      whereClause += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    if (startDate) {
      whereClause += ` AND record_date >= $${paramIndex++}`;
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ` AND record_date <= $${paramIndex++}`;
      params.push(endDate);
    }

    const result = await db.query(
      `SELECT * FROM financial_records ${whereClause} ORDER BY record_date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, pageSize, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM financial_records ${whereClause}`,
      params
    );

    success(res, {
      list: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (err) {
    console.error('获取财务记录错误:', err);
    error(res, '服务器错误');
  }
};

const getFinancialStats = async (req, res) => {
  const { period } = req.query;
  let dateCondition = '';
  let groupBy = '';

  switch (period) {
    case 'day':
      dateCondition = "DATE_TRUNC('day', record_date) = CURRENT_DATE";
      groupBy = "DATE_TRUNC('day', record_date)";
      break;
    case 'month':
      dateCondition = "DATE_TRUNC('month', record_date) = DATE_TRUNC('month', CURRENT_DATE)";
      groupBy = "DATE_TRUNC('month', record_date)";
      break;
    case 'year':
      dateCondition = "DATE_TRUNC('year', record_date) = DATE_TRUNC('year', CURRENT_DATE)";
      groupBy = "DATE_TRUNC('year', record_date)";
      break;
    default:
      dateCondition = "DATE_TRUNC('month', record_date) = DATE_TRUNC('month', CURRENT_DATE)";
      groupBy = "DATE_TRUNC('month', record_date)";
  }

  try {
    const incomeResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM financial_records
       WHERE type = 'income' AND ${dateCondition}`
    );

    const expenseResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM financial_records
       WHERE type = 'expense' AND ${dateCondition}`
    );

    const categoryResult = await db.query(
      `SELECT category, SUM(amount) as total
       FROM financial_records
       WHERE ${dateCondition}
       GROUP BY category`
    );

    success(res, {
      income: parseFloat(incomeResult.rows[0].total),
      expense: parseFloat(expenseResult.rows[0].total),
      profit: parseFloat(incomeResult.rows[0].total) - parseFloat(expenseResult.rows[0].total),
      byCategory: categoryResult.rows
    });
  } catch (err) {
    console.error('获取财务统计错误:', err);
    error(res, '服务器错误');
  }
};

const createHourTopup = async (req, res) => {
  const { student_id, amount, admin_id } = req.body;

  try {
    await db.query('BEGIN');

    await db.query(
      'INSERT INTO hour_topups (student_id, amount, admin_id) VALUES ($1, $2, $3)',
      [student_id, amount, admin_id]
    );

    await db.query(
      'UPDATE students SET remaining_hours = remaining_hours + $1 WHERE id = $2',
      [amount, student_id]
    );

    await db.query('COMMIT');

    success(res, null, '充值成功');
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('课时充值错误:', err);
    error(res, '服务器错误');
  }
};

const getHourTopups = async (req, res) => {
  const { studentId, page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (studentId) {
      whereClause += ` AND student_id = $${paramIndex++}`;
      params.push(studentId);
    }

    const result = await db.query(
      `SELECT ht.*, s.name as student_name, a.name as admin_name
       FROM hour_topups ht
       JOIN students s ON ht.student_id = s.id
       LEFT JOIN admins a ON ht.admin_id = a.id
       ${whereClause}
       ORDER BY ht.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, pageSize, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM hour_topups ${whereClause}`,
      params
    );

    success(res, {
      list: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (err) {
    console.error('获取充值记录错误:', err);
    error(res, '服务器错误');
  }
};

module.exports = {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialStats,
  createHourTopup,
  getHourTopups
};
