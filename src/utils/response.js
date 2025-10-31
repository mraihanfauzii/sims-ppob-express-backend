const jsonResponse = (res, httpCode, status, message, data = null) => {
  return res.status(httpCode).json({
    status: status,
    message: message,
    data: data,
  });
};

module.exports = { jsonResponse };