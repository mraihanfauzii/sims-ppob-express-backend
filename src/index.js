const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { jsonResponse } = require('./utils/response');

// Import routes
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = new express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('SIMS PPOB API is running...');
});

app.use('/', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  jsonResponse(res, 500, 108, 'Terjadi kesalahan pada server', null);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});