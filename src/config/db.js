import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const useSSL = process.env.DB_SSL === 'true';

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(useSSL
    ? {
        ssl: {
          rejectUnauthorized: true,
          ca: process.env.DB_CA_CERT,
        },
      }
    : {}),
});

export const connectDB = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('DB connect failed:', err.message);
        reject(err);
      } else {
        console.log('MySQL connected ✅');
        resolve();
      }
    });
  });
};