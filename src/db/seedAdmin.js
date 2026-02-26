import bcrypt from 'bcrypt';
import { db } from '../config/db.js';

function q(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

export async function seedAdmin() {
  const name = process.env.ADMIN_NAME || 'Artem';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error('ADMIN_PASSWORD is required to seed admin');
  }

  // 1) роль admin
  await q(`INSERT INTO user_roles (name) VALUES ('admin') ON DUPLICATE KEY UPDATE name=name`);

  const roles = await q(`SELECT id FROM user_roles WHERE name='admin' LIMIT 1`);
  const adminRoleId = roles[0].id;

  // 2) пользователь (если уже есть — не трогаем)
  const existing = await q(`SELECT id FROM users WHERE name=? LIMIT 1`, [name]);
  if (existing.length) {
    console.log(`Admin '${name}' already exists ✅`);
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await q(`INSERT INTO users (name, password, role_id) VALUES (?, ?, ?)`, [name, hash, adminRoleId]);

  console.log(`Admin '${name}' created ✅`);
}