const express = require('express');
const router = express.Router();
const {
  getParentHome,
  getParentStudents,
  getParentSchedule,
  getParentGrowth,
  getParentStudentDetail,
  getParentHourHistory,
  getCoachHome,
  getCoachTodayClasses,
  getCoachClassDetail,
  getCoachStudents,
  getCoachStudentDetail,
  submitClassAttendance,
  getCoachStats
} = require('../controllers/miniprogram.controller');

// 家长端
router.get('/parent/home', getParentHome);
router.get('/parent/students', getParentStudents);
router.get('/parent/schedule/:studentId', getParentSchedule);
router.get('/parent/growth/:studentId', getParentGrowth);
router.get('/parent/student/:studentId', getParentStudentDetail);
router.get('/parent/hour-history/:studentId', getParentHourHistory);

// 教练端
router.get('/coach/home', getCoachHome);
router.get('/coach/today-classes', getCoachTodayClasses);
router.get('/coach/class-record/:recordId', getCoachClassDetail);
router.get('/coach/students', getCoachStudents);
router.get('/coach/student/:studentId', getCoachStudentDetail);
router.post('/coach/class-record/:recordId/attendance', submitClassAttendance);
router.get('/coach/stats', getCoachStats);

module.exports = router;
