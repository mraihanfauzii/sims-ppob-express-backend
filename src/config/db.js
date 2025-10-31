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
});

const query = (text, params) => {
  // Menampilkan query di console untuk debugging
  console.log('QUERY:', text, params || ''); 
  return pool.query(text, params);
};

module.exports = {
  query,
  pool,
};