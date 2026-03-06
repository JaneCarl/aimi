const express = require('express');
const router = express.Router();
const { getClassRecords, getCoachTodayClasses, getClassRecordDetail, updateClassRecordStatus, batchCheckin, updateAttendance, createGrowthRecord, getStudentGrowthRecords, getClassAttendance } = require('../controllers/classRecord.controller');

router.get('/', getClassRecords);
router.post('/', getClassRecords);

router.get('/coach/today', getCoachTodayClasses);
router.get('/:recordId', getClassRecordDetail);
router.put('/:id/status', updateClassRecordStatus);
router.post('/batch-checkin', batchCheckin);
router.put('/attendance/:id', updateAttendance);

router.post('/growth-records', createGrowthRecord);
router.get('/growth-records/student/:studentId', getStudentGrowthRecords);
router.get('/record/:recordId/attendance', getClassAttendance);

module.exports = router;
