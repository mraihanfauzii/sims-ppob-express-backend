const { pool } = require('../config/db');
const { generateInvoiceNumber } = require('../utils/invoiceGenerator');

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

module.exports = {
  performTopUp,
};
