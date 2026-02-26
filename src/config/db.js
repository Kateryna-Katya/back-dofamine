import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
});

export const connectDB = () =>
  new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) return reject(err);
      console.log('MySQL подключен ✅');
      resolve();
    });
  });