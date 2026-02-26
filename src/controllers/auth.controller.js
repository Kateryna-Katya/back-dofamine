import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const login = (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'name and password required' });
  }

  db.query('SELECT * FROM users WHERE name = ?', [name], async (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });

    if (!rows?.length) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) return res.status(401).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: 'Login success 🔥',
      token,
      user: { id: user.id, name: user.name, role_id: user.role_id },
    });
  });
};
