const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /registration
router.post('/registration', authController.register);

// POST /login
router.post('/login', authController.login);

module.exports = router;