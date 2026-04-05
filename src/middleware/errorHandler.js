const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found / Invalid ID';
  } else if (err.isJoi) {
    statusCode = 400;
    message = err.details.map(d => d.message).join(', ');
  }

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
