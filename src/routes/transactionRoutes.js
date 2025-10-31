const express = require('express');
const { getBalance, topUp, transaction, getHistory } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Semua endpoint dilindungi oleh authMiddleware
router.get('/balance', authMiddleware, getBalance);
router.post('/topup', authMiddleware, topUp);
router.post('/transaction', authMiddleware, transaction);
router.get('/transaction/history', authMiddleware, getHistory);

module.exports = router;