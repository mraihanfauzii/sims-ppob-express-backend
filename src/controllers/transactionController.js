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

const transaction = async (req, res, next) => {
  try {
    const { service_code } = req.body;
    const user = req.user;

    // 1. Validasi input
    if (!service_code) {
      return jsonResponse(res, 400, 102, 'Parameter service_code harus diisi');
    }
    
    // 2. Panggil service untuk melakukan pembayaran
    const transactionData = await transactionService.performPayment(user, service_code);
    
    // 3. Kembalikan response sukses
    return jsonResponse(res, 200, 0, 'Transaksi berhasil', transactionData);

  } catch (error)
 {
    if (error.status === 400) {
      return jsonResponse(res, 400, error.code || 102, error.message);
    }
    next(error); // Error 500
  }
};

const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Ambil limit dan offset dari query params
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : null; 

    // Validasi offset/limit
    if (isNaN(offset)) {
      return jsonResponse(res, 400, 102, 'Offset harus berupa angka');
    }
    if (limit !== null && isNaN(limit)) {
      return jsonResponse(res, 400, 102, 'Limit harus berupa angka');
    }

    const records = await transactionService.getHistory(userId, offset, limit);
    
    return jsonResponse(res, 200, 0, 'Get History Berhasil', {
      offset: offset,
      limit: limit === null ? records.length : limit,
      records: records,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance,
  topUp,
  transaction,
  getHistory,
};