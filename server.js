// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reportRoutes = require('./src/routes/reportRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/reports', reportRoutes);

// Welcome route for the root URL
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Welcome to the Smart Pothole Reporting and Monitoring System (SPRMS) API!' 
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SPRMS Backend API is running smoothly',
  });
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception (App Crashed!):', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection (App Crashed!):', err);
});
