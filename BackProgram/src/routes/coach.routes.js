const express = require('express');
const router = express.Router();
const { getCoaches, createCoach, updateCoach, deleteCoach, getCoachStats } = require('../controllers/coach.controller');

router.get('/', getCoaches);
router.post('/', createCoach);
router.get('/:id/stats', getCoachStats);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);

module.exports = router;
