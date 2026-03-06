const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse, getClasses, createClass, updateClass, deleteClass, getClassStudents } = require('../controllers/course.controller');

router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/classes', getClasses);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);
router.get('/classes/:id/students', getClassStudents);

module.exports = router;
