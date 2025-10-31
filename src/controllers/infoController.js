const infoService = require('../services/infoService');
const { jsonResponse } = require('../utils/response');

const getBanners = async (req, res, next) => {
  try {
    const banners = await infoService.getBanners();
    return jsonResponse(res, 200, 0, 'Sukses', banners);
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const services = await infoService.getServices();
    return jsonResponse(res, 200, 0, 'Sukses', services);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  getServices,
};
