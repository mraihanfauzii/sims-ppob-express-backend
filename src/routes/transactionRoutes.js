const express = require('express');
const { getBalance, topUp } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Semua endpoint dilindungi oleh authMiddleware
router.get('/balance', authMiddleware, getBalance);
router.post('/topup', authMiddleware, topUp);

module.exports = router;