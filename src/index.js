import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes/index.js';
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { migrate } from './db/migrate.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// healthcheck
app.get('/', (req, res) => res.json({ message: 'Backend works 🚀' }));

// API
app.use('/api', routes);

// errors
app.use(errorMiddleware);

const port = Number(process.env.PORT) || 5050;

(async () => {
  try {
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);

    await connectDB();

    if (process.env.RUN_MIGRATIONS === 'true') {
      await migrate();
      console.log('DB migrated ✅');
    }

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (e) {
    console.error('Startup failed:', e.message);
    process.exit(1);
  }
})();