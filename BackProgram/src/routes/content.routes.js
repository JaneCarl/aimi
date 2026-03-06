const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner, getPromotionalCourses, createPromotionalCourse, updatePromotionalCourse, deletePromotionalCourse } = require('../controllers/content.controller');

router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

router.get('/promotional-courses', getPromotionalCourses);
router.post('/promotional-courses', createPromotionalCourse);
router.put('/promotional-courses/:id', updatePromotionalCourse);
router.delete('/promotional-courses/:id', deletePromotionalCourse);

module.exports = router;
