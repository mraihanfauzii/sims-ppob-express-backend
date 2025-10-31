const { pool } = require('../config/db');

// Mengambil semua data banner
const getBanners = async () => {
  const queryText = 'SELECT banner_name, banner_image, description FROM banners';
  try {
    const { rows } = await pool.query(queryText);
    return rows;
  } catch (error) {
    console.error('Error getting banners:', error);
    throw error;
  }
};

// Mengambil semua data service/layanan
const getServices = async () => {
  const queryText = 'SELECT service_code, service_name, service_icon, service_tariff FROM services';
  try {
    const { rows } = await pool.query(queryText);
    return rows;
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
};

// Mencari service berdasarkan service_code.
const findServiceByCode = async (serviceCode) => {
  const query = {
    text: 'SELECT * FROM services WHERE service_code = $1',
    values: [serviceCode],
  };
  try {
    const { rows } = await pool.query(query);
    return rows[0];
  } catch (error) {
    console.error('Error finding service by code:', error);
    throw error;
  }
};

module.exports = {
  getBanners,
  getServices,
  findServiceByCode,
};