const { pool } = require('../config/db');

const findUserByEmail = async (email) => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  console.log('QUERY:', query.text, query.values);
  const { rows } = await pool.query(query);
  return rows[0];
};

const createUser = async (email, first_name, last_name, password) => {
  // Hash password di dalam service
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = {
    text: 'INSERT INTO users (email, first_name, last_name, "password") VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
    values: [email, first_name, last_name, hashedPassword],
  };
  console.log('QUERY:', query.text, query.values); // Debug query
  const { rows } = await pool.query(query); // (FIX) Gunakan pool.query
  return rows[0];
};

const updateUserProfile = async (email, firstName, lastName) => {
  const query = {
    text: `
      UPDATE users 
      SET first_name = $1, last_name = $2
      WHERE email = $3 
      RETURNING email, first_name, last_name, profile_image
    `,
    values: [firstName, lastName, email],
  };
  console.log('QUERY:', query.text, query.values);
  const { rows } = await pool.query(query);
  return rows[0];
};

const updateProfileImage = async (email, profileImageUrl) => {
  const query = {
    text: `
      UPDATE users 
      SET profile_image = $1 
      WHERE email = $2 
      RETURNING email, first_name, last_name, profile_image
    `,
    values: [profileImageUrl, email],
  };
  console.log('QUERY:', query.text, query.values); // Debug query
  const { rows } = await pool.query(query);
  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  updateUserProfile,
  updateProfileImage,
};