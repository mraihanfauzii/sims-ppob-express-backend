const transactionService = require('../services/transactionService');
const { jsonResponse } = require('../utils/response');

const getBalance = async (req, res, next) => {
  try {
    const { balance } = req.user;
    return jsonResponse(res, 200, 0, 'Get Balance Berhasil', {
      balance: parseInt(balance)
    });
  } catch (error) {
    next(error);
  }
};

const topUp = async (req, res, next) => {
  try {
    const { top_up_amount } = req.body;
    const user = req.user;

    // 1. Validasi input -> Parameter amount hanya boleh angka saja dan tidak boleh lebih kecil dari 0
    if (typeof top_up_amount !== 'number' || top_up_amount <= 0) {
      return jsonResponse(res, 400, 102, 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
    }
    
    // 2. Panggil service untuk melakukan top up
    const newBalance = await transactionService.performTopUp(user, top_up_amount);
    
    // 3. Kembalikan response sukses dengan saldo baru
    return jsonResponse(res, 200, 0, 'Top Up Balance berhasil', {
      balance: newBalance
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance,
  topUp,
};