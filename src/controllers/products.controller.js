import { db } from '../config/db.js';
export const createProduct = (req, res) => {
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
  } = req.body;

  if (!name) return res.status(400).json({ message: 'name required' });

  const qty = Number.isFinite(Number(quantity)) ? Number(quantity) : 0;

  const pricesJson = prices ? JSON.stringify(prices) : null;
  const featuresJson = features ? JSON.stringify(features) : null;

  db.query(
    `INSERT INTO products
     (name, quantity, badge, variant, button_text, button_link, geos, prices_json, features_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, qty, badge, variant, button_text, button_link, geos, pricesJson, featuresJson],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
};
export const listProducts = (req, res) => {
  db.query('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });

    const normalized = rows.map((p) => ({
      ...p,
      prices: p.prices_json ? JSON.parse(p.prices_json) : [],
      features: p.features_json ? JSON.parse(p.features_json) : [],
    }));

    res.json(normalized);
  });
};
export const updateProduct = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  const fields = [];
  const values = [];

  Object.entries(req.body).forEach(([key, value]) => {
    if (key === 'prices') {
      fields.push('prices_json = ?');
      values.push(JSON.stringify(value));
    } else if (key === 'features') {
      fields.push('features_json = ?');
      values.push(JSON.stringify(value));
    } else {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (!fields.length) {
    return res.status(400).json({ message: 'nothing to update' });
  }

  values.push(id);

  db.query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    values,
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: 'updated' });
    }
  );
};
export const deleteProduct = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'product not found' });
    }

    res.json({ message: 'deleted' });
  });
};