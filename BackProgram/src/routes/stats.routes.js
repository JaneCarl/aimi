const express = require('express');
const router = express.Router();
const { getAttendanceStats, getCoachStats, getStudentGrowth, getRevenueStats } = require('../controllers/stats.controller');

router.get('/attendance', getAttendanceStats);
router.get('/coach/:coachId', getCoachStats);
router.get('/student-growth', getStudentGrowth);
router.get('/revenue', getRevenueStats);

module.exports = router;
