export const errorMiddleware = (err, req, res, next) => {
  console.error('ERR:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
};