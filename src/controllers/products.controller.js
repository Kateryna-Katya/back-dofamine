import { db } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const safeJson = (v, fallback) => {
  if (v === null || v === undefined) return fallback;
  try {
    const s = Buffer.isBuffer(v) ? v.toString('utf8') : v;
    if (typeof s === 'string') return JSON.parse(s);
    return s;
  } catch {
    return fallback;
  }
};

const queryAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

// ✅ whitelist полей, которые можно обновлять
const UPDATABLE_FIELDS = new Set([
  'name',
  'quantity',
  'badge',
  'variant',
  'button_text',
  'button_link',
  'geos',
  'prices',   // мапится в prices_json
  'features', // мапится в features_json
]);

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    quantity = 0,
    badge = null,
    variant = 'default',
    button_text = 'Купить',
    button_link = 'https://t.me/tmlfarm',
    geos = null,
    prices = null,   // массив объектов
    features = null, // массив строк
  } = req.body || {};

  if (!name || String(name).trim().length === 0) {
    return res.status(400).json({ message: 'name required' });
  }

  const qtyNum = Number(quantity);
  const qty = Number.isFinite(qtyNum) ? qtyNum : 0;

  const pricesJson = prices ? JSON.stringify(prices) : null;
  const featuresJson = features ? JSON.stringify(features) : null;

  const result = await queryAsync(
    `INSERT INTO products
     (name, quantity, badge, variant, button_text, button_link, geos, prices_json, features_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      String(name).trim(),
      qty,
      badge,
      variant,
      button_text,
      button_link,
      geos,
      pricesJson,
      featuresJson,
    ]
  );

  res.status(201).json({ id: result.insertId });
});

export const listProducts = asyncHandler(async (req, res) => {
  const rows = await queryAsync('SELECT * FROM products ORDER BY id DESC');

  const normalized = rows.map((p) => ({
    ...p,
    prices: safeJson(p.prices_json, []),
    features: safeJson(p.features_json, []),
  }));

  res.json(normalized);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  const body = req.body || {};
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(body)) {
    if (!UPDATABLE_FIELDS.has(key)) continue;

    if (key === 'prices') {
      fields.push('prices_json = ?');
      values.push(value == null ? null : JSON.stringify(value));
      continue;
    }

    if (key === 'features') {
      fields.push('features_json = ?');
      values.push(value == null ? null : JSON.stringify(value));
      continue;
    }

    if (key === 'quantity') {
      const qtyNum = Number(value);
      values.push(Number.isFinite(qtyNum) ? qtyNum : 0);
      fields.push('quantity = ?');
      continue;
    }

    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (!fields.length) {
    return res.status(400).json({ message: 'nothing to update' });
  }

  values.push(id);

  const result = await queryAsync(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'product not found' });
  }

  res.json({ message: 'updated' });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  const result = await queryAsync('DELETE FROM products WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'product not found' });
  }

  res.json({ message: 'deleted' });
});