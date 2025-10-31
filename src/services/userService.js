const { query } = require('../config/db');

const findUserByEmail = async (email) => {
  const q = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await query(q, [email]);
  return rows[0]; // Kembalikan user pertama (atau undefined jika tidak ada)
};

const createUser = async (email, firstName, lastName, hashedPassword) => {
  const q = `
    INSERT INTO users (email, first_name, last_name, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, first_name, last_name, profile_image, balance
  `;
  const { rows } = await query(q, [email, firstName, lastName, hashedPassword]);
  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
};