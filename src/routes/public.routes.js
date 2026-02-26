import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

const safeJson = (v, fallback) => {
  if (!v) return fallback;
  try {
    const s = Buffer.isBuffer(v) ? v.toString('utf8') : v;
    return typeof s === 'string' ? JSON.parse(s) : s;
  } catch {
    return fallback;
  }
};

router.get('/products', (req, res) => {
  db.query(
    `SELECT
      id,
      name,
      badge,
      variant,
      button_text,
      button_link,
      geos,
      prices_json,
      features_json
     FROM products
     ORDER BY id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });

      const normalized = rows.map((p) => ({
        id: p.id,
        name: p.name,
        badge: p.badge,
        variant: p.variant,
        button_text: p.button_text,
        button_link: p.button_link,
        geos: p.geos,
        prices: safeJson(p.prices_json, []),
        features: safeJson(p.features_json, []),
      }));

      res.json(normalized);
    }
  );
});

export default router;