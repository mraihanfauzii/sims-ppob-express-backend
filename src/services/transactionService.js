const { pool } = require('../config/db');
const { generateInvoiceNumber } = require('../utils/invoiceGenerator');
const infoService = require('../services/infoService');

const performTopUp = async (user, amount) => {
  // 1. Koneksi client dari pool
  const client = await pool.connect();
  
  try {
    // 2. Mulai Transaction
    await client.query('BEGIN');

    // 3. Update saldo user
    const updateBalanceQuery = `
      UPDATE users SET balance = balance + $1, updated_at = NOW()
      WHERE id = $2
      RETURNING balance
    `;
    // Menggunakan prepared statement: $1 = amount, $2 = user.id
    const balanceResult = await client.query(updateBalanceQuery, [amount, user.id]);
    const newBalance = balanceResult.rows[0].balance;

    // 4. Buat invoice number
    const invoiceNumber = generateInvoiceNumber();
    
    // 5. Catat ke tabel transactions
    const insertTransactionQuery = `
      INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount, created_on)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    const transactionType = 'TOPUP';
    const description = 'Top Up balance';
    // Menggunakan prepared statement
    await client.query(insertTransactionQuery, [
      user.id,
      invoiceNumber,
      transactionType,
      description,
      amount,
    ]);

    // 6. Selesaikan Transaction
    await client.query('COMMIT');
    
    // 7. Kembalikan saldo baru
    return newBalance;

  } catch (error) {
    // 8. Jika terjadi error, batalkan semua perubahan
    await client.query('ROLLBACK');
    console.error('Error in Top Up Transaction:', error);
    throw new Error('Transaksi Top Up gagal');
  } finally {
    // 9. Selalu lepaskan client kembali ke pool
    client.release();
  }
};

const performPayment = async (user, serviceCode) => {
  const client = await pool.connect();

  try {
    // 1. Cek Layanan & Saldo (sebelum memulai transaksi DB)
    const service = await infoService.findServiceByCode(serviceCode);
    if (!service) {
      const err = new Error('Service atau Layanan tidak ditemukan');
      err.status = 400;
      err.code = 102;
      throw err;
    }

    // Pastikan saldo adalah angka sebelum membandingkan
    const currentBalance = parseInt(user.balance);
    const serviceTariff = parseInt(service.service_tariff);

    if (currentBalance < serviceTariff) {
      const err = new Error('Saldo tidak mencukupi');
      err.status = 400;
      err.code = 102;
      throw err;
    }

    // 2. Mulai Transaksi Atomik
    await client.query('BEGIN');

    // 3. Kurangi Saldo User
    const newBalance = currentBalance - serviceTariff;
    const updateBalanceQuery = `
      UPDATE users SET balance = $1, updated_at = NOW()
      WHERE id = $2
    `;
    await client.query(updateBalanceQuery, [newBalance, user.id]);

    // 4. Catat Transaksi (Tipe: PAYMENT)
    const invoiceNumber = generateInvoiceNumber();
    const transactionType = 'PAYMENT';
    const createdOn = new Date()

    const insertTransactionQuery = `
      INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount, created_on)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await client.query(insertTransactionQuery, [
      user.id,
      invoiceNumber,
      transactionType,
      service.service_name,
      serviceTariff,
      createdOn,
    ]);
    
    // 5. Selesaikan Transaksi
    await client.query('COMMIT');

    // 6. Kembalikan data sesuai kontrak API
    const newTransaction = rows[0];
    return {
      invoice_number: newTransaction.invoice_number,
      service_code: service.service_code,
      service_name: service.service_name,
      transaction_type: newTransaction.transaction_type,
      total_amount: parseInt(newTransaction.total_amount),
      created_on: newTransaction.created_on.toISOString(),
    };

  } catch (error) {
    // 7. Jika terjadi error, batalkan semua
    await client.query('ROLLBACK');
    console.error('Error in Payment Transaction:', error);
    throw error;
  } finally {
    // 8. Selalu lepaskan client
    client.release();
  }
};

const getHistory = async (userId, offset, limit) => {
  // Query dasar, diurutkan sesuai kontrak (terbaru dulu)
  let queryText = `
    SELECT 
      invoice_number, 
      transaction_type, 
      description, 
      total_amount, 
      created_on 
    FROM transactions 
    WHERE user_id = $1 
    ORDER BY created_on DESC
  `;
  
  const params = [userId];

  // Cek jika limit BUKAN null dan merupakan angka
  if (limit !== null && !isNaN(limit)) {
    queryText += ` LIMIT $${params.length + 1}`;
    params.push(limit);
  }
  
  // Cek jika offset BUKAN null dan merupakan angka
  if (offset !== null && !isNaN(offset)) {
    queryText += ` OFFSET $${params.length + 1}`;
    params.push(offset);
  }

  try {
    const { rows } = await pool.query(queryText, params);
    // Format response agar konsisten (total_amount jadi integer, created_on jadi ISO string)
    return rows.map(row => ({
      invoice_number: row.invoice_number,
      transaction_type: row.transaction_type,
      description: row.description,
      total_amount: parseInt(row.total_amount),
      created_on: row.created_on.toISOString(),
    }));
  } catch (error) {
    console.error('Error getting transaction history:', error);
    throw error;
  }
};

module.exports = {
  performTopUp,
  performPayment,
  getHistory,
};