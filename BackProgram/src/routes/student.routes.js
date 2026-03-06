const express = require('express');
const router = express.Router();
const { getStudents, createStudent, updateStudent, deleteStudent, bindParent, unbindParent, assignClass, getStudentDetail } = require('../controllers/student.controller');

router.get('/', getStudents);
router.post('/', createStudent);
router.get('/:id', getStudentDetail);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/:id/bind-parent', bindParent);
router.delete('/:id/unbind-parent/:parentId', unbindParent);
router.post('/:id/assign-class', assignClass);

module.exports = router;
