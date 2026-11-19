/**
 * Centralized Error Handling Middleware
 * Formats errors into a standardized JSON response
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  // Handle MySQL duplicate key error (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with this identifier or email already exists.',
      error: err.message
    });
  }

  // Handle MySQL Foreign Key constraint failure
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced student does not exist.',
      error: err.message
    });
  }

  // Handle MySQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MySQL is running.',
      error: err.message
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
