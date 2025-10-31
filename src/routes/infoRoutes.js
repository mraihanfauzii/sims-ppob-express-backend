const express = require('express');
const { getBanners, getServices } = require('../controllers/infoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/banner', getBanners);
router.get('/services', authMiddleware, getServices);

module.exports = router;