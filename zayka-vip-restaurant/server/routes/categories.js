const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, COUNT(p.id)::int AS product_count
      FROM categories c LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id ORDER BY c.sort_order ASC
    `);
    res.json({ success: true, categories: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });
    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = 'cat_' + uuidv4().slice(0, 8);
    const result = await db.query(
      `INSERT INTO categories (id, name, slug, icon, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, name, cleanSlug, icon || 'Utensils', sort_order || 0]
    );
    res.status(201).json({ success: true, message: 'Category created.', category: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body;
    const result = await db.query(`
      UPDATE categories SET name=COALESCE($1,name), slug=COALESCE($2,slug),
      icon=COALESCE($3,icon), sort_order=COALESCE($4,sort_order)
      WHERE id=$5 RETURNING *
    `, [name, slug, icon, sort_order ?? null, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category updated.', category: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
});

module.exports = router;
