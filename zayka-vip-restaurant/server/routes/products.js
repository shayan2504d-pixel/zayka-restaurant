const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, search, dessert, special, available } = req.query;
    let query = `SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE 1=1`;
    const params = [];
    if (category) { params.push(category); const n=params.length; query += ` AND (c.slug=$${n} OR c.id=$${n})`; }
    if (dessert === '1') query += ' AND p.is_dessert=1';
    if (special === '1') query += ' AND p.is_special=1';
    if (available === '1') query += ' AND p.is_available=1';
    if (search) {
      params.push(`%${search.trim().toLowerCase()}%`);
      const n = params.length;
      query += ` AND (LOWER(p.name) LIKE $${n} OR LOWER(p.description) LIKE $${n} OR LOWER(p.tags) LIKE $${n})`;
    }
    query += ' ORDER BY p.is_special DESC, p.created_at DESC';
    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, products: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE p.id=$1`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    if (!b.name || !b.price || !b.category_id) return res.status(400).json({ success: false, message: 'Name, price, and category are required.' });
    const id = 'prod_' + uuidv4().slice(0, 8);
    const result = await db.query(`
      INSERT INTO products (id,name,description,price,discount_price,category_id,image,is_available,is_special,is_dessert,spicy_level,tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *
    `, [id,b.name,b.description||'',parseFloat(b.price),b.discount_price?parseFloat(b.discount_price):null,b.category_id,b.image||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      b.is_available!==undefined?(b.is_available?1:0):1,b.is_special?1:0,b.is_dessert?1:0,b.spicy_level?parseInt(b.spicy_level):0,b.tags||'']);
    res.status(201).json({ success: true, message: 'Product created successfully.', product: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const b=req.body;
    const existing=await db.query('SELECT id FROM products WHERE id=$1',[req.params.id]);
    if(!existing.rows.length) return res.status(404).json({success:false,message:'Product not found.'});
    const result=await db.query(`
      UPDATE products SET name=COALESCE($1,name), description=COALESCE($2,description),
      price=COALESCE($3,price), discount_price=$4, category_id=COALESCE($5,category_id),
      image=COALESCE($6,image), is_available=COALESCE($7,is_available), is_special=COALESCE($8,is_special),
      is_dessert=COALESCE($9,is_dessert), spicy_level=COALESCE($10,spicy_level), tags=COALESCE($11,tags)
      WHERE id=$12 RETURNING *
    `,[b.name,b.description,b.price!==undefined?parseFloat(b.price):null,b.discount_price!==undefined?(b.discount_price?parseFloat(b.discount_price):null):null,
      b.category_id,b.image,b.is_available!==undefined?(b.is_available?1:0):null,b.is_special!==undefined?(b.is_special?1:0):null,
      b.is_dessert!==undefined?(b.is_dessert?1:0):null,b.spicy_level!==undefined?parseInt(b.spicy_level):null,b.tags,req.params.id]);
    res.json({success:true,message:'Product updated successfully.',product:result.rows[0]});
  } catch(error) {
    res.status(500).json({success:false,message:'Failed to update product.'});
  }
});

router.delete('/:id', requireAdmin, async (req,res)=>{
  try { await db.query('DELETE FROM products WHERE id=$1',[req.params.id]); res.json({success:true,message:'Product deleted successfully.'}); }
  catch(error) { res.status(500).json({success:false,message:'Failed to delete product.'}); }
});

module.exports=router;
