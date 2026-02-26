export const errorMiddleware = (err, req, res, next) => {
    console.error('ERR:', err);
    res.status(500).json({ message: 'Server error', detail: err?.message });
  };