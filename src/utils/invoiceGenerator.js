/**
 * Membuat ID invoice unik.
 * Format: INV<YYYYMMDD>-<timestamp>-<rand>
 * Contoh: INV20230817-1692252197-001
 */
const generateInvoiceNumber = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Bulan (0-11)
  const dd = String(date.getDate()).padStart(2, '0');
  
  const timestamp = Math.floor(date.getTime() / 1000); // Unix timestamp
  const randomSuffix = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

  return `INV${yyyy}${mm}${dd}-${timestamp}-${randomSuffix}`;
};

module.exports = { generateInvoiceNumber };