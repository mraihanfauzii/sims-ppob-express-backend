const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { jsonResponse } = require('./utils/response');
const bcrypt = require('bcryptjs'); 

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes')
const infoRoutes = require('./routes/infoRoutes');

dotenv.config();

const app = new express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('SIMS PPOB API is running...');
});

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', infoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return jsonResponse(res, 401, 108, 'Token tidak valid atau kadaluwarsa', null);
  }
  
  console.error(err.stack);
  jsonResponse(res, 500, 108, 'Terjadi kesalahan pada server', null);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});