const express = require('express');
const { getProfile, updateProfile, updateProfileImage } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

const router = express.Router();

// Semua endpoint dilindungi authMiddleware
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, updateProfile);

router.put('/profile/image', authMiddleware, upload.single('file'), updateProfileImage);

module.exports = router;