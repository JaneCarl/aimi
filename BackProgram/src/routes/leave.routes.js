const express = require('express');
const router = express.Router();
const { createLeaveRequest, getStudentLeaveRequests, getPendingLeaveRequests, approveLeaveRequest } = require('../controllers/leave.controller');

router.post('/', createLeaveRequest);
router.get('/pending', getPendingLeaveRequests);
router.get('/student/:studentId', getStudentLeaveRequests);
router.put('/:id/approve', approveLeaveRequest);

module.exports = router;
