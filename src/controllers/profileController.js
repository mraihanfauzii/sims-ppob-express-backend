const userService = require('../services/userService');
const { jsonResponse } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const { email, first_name, last_name, profile_image } = req.user;

    return jsonResponse(res, 200, 0, 'Sukses', {
      email,
      first_name,
      last_name,
      profile_image,
    });
  } catch (error) {
    next(error);
  }
};

// Controller untuk Update Profile (Nama)
const updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    const { email } = req.user;

    // Validasi input
    if (!first_name || !last_name) {
      return jsonResponse(res, 400, 102, 'first_name dan last_name harus diisi');
    }

    const updatedUser = await userService.updateUserProfile(email, first_name, last_name);

    return jsonResponse(res, 200, 0, 'Update Pofile berhasil', updatedUser);
  } catch (error) {
    next(error);
  }
};

// Controller untuk Update Profile Image
const updateProfileImage = async (req, res, next) => {
  try {
    const { email } = req.user;

    // 1. Cek apakah file ada
    if (!req.file) {
      return jsonResponse(res, 400, 102, 'File gambar tidak ditemukan');
    }

    // 2. Validasi format file (sesuai kontrak: jpeg/png)
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return jsonResponse(res, 400, 102, 'Format Image tidak sesuai');
    }

    const simulatedImageUrl = 'https://yoururlapi.com/profile-updated.jpeg';

    const updatedUser = await userService.updateProfileImage(email, simulatedImageUrl);

    return jsonResponse(res, 200, 0, 'Update Profile Image berhasil', updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
};