const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const academicRoutes = require('./routes/academicRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Student Management Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/students', studentRoutes);
app.use('/api/academic-records', academicRoutes);

// Catch 404 for unknown endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server and check database connectivity
const server = app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(` Student Management Portal Server`);
  console.log(` Server running on: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
  await testConnection();
});

module.exports = { app, server };
