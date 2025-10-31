const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Konfigurasi pool koneksi database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Koneksi ke database GAGAL:', err.stack);
  } else {
    console.log('Koneksi ke database BERHASIL');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};