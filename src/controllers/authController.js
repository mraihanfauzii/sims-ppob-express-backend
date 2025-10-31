const userService = require('../services/userService');
const { jsonResponse } = require('../utils/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi validasi email sederhana
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Controller untuk Registrasi User (POST /registration)
const register = async (req, res, next) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // 1. Validasi Input
    if (!email || !validateEmail(email)) {
      return jsonResponse(res, 400, 102, 'Paramter email tidak sesuai format');
    }
    if (!password || password.length < 8) {
      return jsonResponse(res, 400, 102, 'Parameter password minimal 8 karakter');
    }
    if (!first_name || !last_name) {
      return jsonResponse(res, 400, 102, 'Parameter first_name atau last_name tidak boleh kosong');
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return jsonResponse(res, 400, 103, 'Email sudah terdaftar'); // Error kustom
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // 4. Simpan ke database
    await userService.createUser(email, first_name, last_name, hashedPassword);

    // 5. Kirim response sukses
    return jsonResponse(res, 200, 0, 'Registrasi berhasil silahkan login');

  } catch (error) {
    next(error); // Lempar ke global error handler
  }
};

// Controller untuk Login User (POST /login)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi Input
    if (!email || !validateEmail(email)) {
      return jsonResponse(res, 400, 102, 'Paramter email tidak sesuai format');
    }
    if (!password || password.length < 8) {
      return jsonResponse(res, 400, 102, 'Parameter password minimal 8 karakter');
    }

    // 2. Cari user di database
    const user = await userService.findUserByEmail(email);
    if (!user) {
      // Error 103
      return jsonResponse(res, 401, 103, 'Username atau password salah');
    }

    // 3. Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Error 103
      return jsonResponse(res, 401, 103, 'Username atau password salah');
    }

    // 4. Buat JWT
    // Payload: { email: user.email }
    // Expires: 12 jam
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 5. Kirim response sukses dengan token
    return jsonResponse(res, 200, 0, 'Login Sukses', {
      token: token,
    });

  } catch (error) {
    next(error); // Lempar ke global error handler
  }
};

module.exports = {
  register,
  login,
};