import { db } from './config/db.js';

const sql = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  badge VARCHAR(50) NULL,
  variant VARCHAR(50) NOT NULL DEFAULT 'default',
  button_text VARCHAR(50) NOT NULL DEFAULT 'Купить',
  button_link VARCHAR(255) NOT NULL DEFAULT 'https://t.me/tmlfarm',
  geos VARCHAR(255) NULL,
  prices_json JSON NULL,
  features_json JSON NULL
);
`;

db.query(sql, (err) => {
  if (err) {
    console.error('❌ Error creating table:', err.message);
  } else {
    console.log('✅ products table created');
  }
  process.exit();
});