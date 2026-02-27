import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes/index.js';
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { migrate } from './db/migrate.js';
import { seedAdmin } from './db/seedAdmin.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://kateryna-katya.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://catharsis-farm.com',
  'https://www.catharsis-farm.com',
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Backend works 🚀' }));

app.use('/api', routes);

app.use(errorMiddleware);

const port = Number(process.env.PORT) || 5050;

(async () => {
  try {
    await connectDB();

    if (process.env.RUN_MIGRATIONS === 'true') {
      await migrate();
      console.log('DB migrated ✅');
    }

    if (process.env.SEED_ADMIN === 'true') {
      await seedAdmin();
    }

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (e) {
    console.error('Startup failed:', e.message);
    process.exit(1);
  }
})();