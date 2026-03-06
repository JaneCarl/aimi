const express = require('express');
const router = express.Router();
const { createFinancialRecord, getFinancialRecords, getFinancialStats, createHourTopup, getHourTopups } = require('../controllers/financial.controller');

router.post('/records', createFinancialRecord);
router.get('/records', getFinancialRecords);
router.get('/records/stats', getFinancialStats);

router.post('/hour-topups', createHourTopup);
router.get('/hour-topups', getHourTopups);

module.exports = router;
