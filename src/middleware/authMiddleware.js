const jwt = require('jsonwebtoken');
const { jsonResponse } = require('../utils/response');
const userService = require('../services/userService');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return jsonResponse(res, 401, 108, 'Token tidak tidak valid atau kadaluwarsa');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return jsonResponse(res, 401, 108, 'Token tidak tidak valid atau kadaluwarsa');
    }

    // Verifikasi token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil email dari payload (sesuai kontrak)
    const email = payload.email;

    // Cari user di database
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return jsonResponse(res, 401, 108, 'User tidak ditemukan');
    }

    // Lampirkan data user ke object request
    delete user.password;
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return jsonResponse(res, 401, 108, 'Token tidak tidak valid atau kadaluwarsa');
  }
};

module.exports = authMiddleware;