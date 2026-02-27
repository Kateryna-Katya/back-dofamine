import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  // ✅ ВАЖНО: не блокируем preflight (OPTIONS)
  if (req.method === 'OPTIONS') return next();

  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  // ✅ тоже пропускаем OPTIONS
  if (req.method === 'OPTIONS') return next();

  if (req.user?.role_id !== 1) {
    return res.status(403).json({ message: 'Admins only' });
  }
  return next();
};