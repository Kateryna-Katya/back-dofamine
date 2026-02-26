import { db } from '../config/db.js';

function q(sql) {
  return new Promise((resolve, reject) => {
    db.query(sql, (err) => (err ? reject(err) : resolve()));
  });
}

export const migrate = async () => {
  // 1) roles
  await q(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    )
  `);

  // 2) users
  await q(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role_id INT NOT NULL,
      FOREIGN KEY (role_id) REFERENCES user_roles(id)
    )
  `);

  // 3) products
  await q(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      badge VARCHAR(50),
      variant VARCHAR(50) DEFAULT 'default',
      button_text VARCHAR(50) DEFAULT 'Купить',
      button_link VARCHAR(255),
      geos VARCHAR(255),
      prices_json JSON,
      features_json JSON
    )
  `);
};