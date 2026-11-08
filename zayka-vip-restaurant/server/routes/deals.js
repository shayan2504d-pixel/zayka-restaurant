const express=require('express');
const router=express.Router();
const {v4:uuidv4}=require('uuid');
const db=require('../db');
const {requireAdmin}=require('../middleware/auth');

router.get('/',async(req,res)=>{try{const r=await db.query('SELECT * FROM deals WHERE is_active=1 ORDER BY deal_price ASC');res.json({success:true,count:r.rows.length,deals:r.rows});}catch(e){res.status(500).json({success:false,message:'Failed to fetch deals.'});}});
router.get('/all',requireAdmin,async(req,res)=>{try{const r=await db.query('SELECT * FROM deals ORDER BY created_at DESC');res.json({success:true,count:r.rows.length,deals:r.rows});}catch(e){res.status(500).json({success:false,message:'Failed to fetch deals.'});}});

router.post('/',requireAdmin,async(req,res)=>{
  try{const b=req.body;if(!b.title||!b.original_price||!b.deal_price)return res.status(400).json({success:false,message:'Title, price, and deal price are required.'});
  const id='deal_'+uuidv4().slice(0,8);const r=await db.query(`INSERT INTO deals(id,title,description,items_included,original_price,deal_price,image,badge,is_active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
  [id,b.title,b.description||'',b.items_included||'',parseFloat(b.original_price),parseFloat(b.deal_price),b.image||'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',b.badge||'Special Deal',b.is_active!==undefined?(b.is_active?1:0):1]);
  res.status(201).json({success:true,message:'Deal created successfully.',deal:r.rows[0]});}catch(e){res.status(500).json({success:false,message:'Failed to create deal.'});}
});
router.put('/:id',requireAdmin,async(req,res)=>{try{const b=req.body;const r=await db.query(`UPDATE deals SET title=COALESCE($1,title),description=COALESCE($2,description),items_included=COALESCE($3,items_included),original_price=COALESCE($4,original_price),deal_price=COALESCE($5,deal_price),image=COALESCE($6,image),badge=COALESCE($7,badge),is_active=COALESCE($8,is_active) WHERE id=$9 RETURNING *`,
[b.title,b.description,b.items_included,b.original_price!==undefined?parseFloat(b.original_price):null,b.deal_price!==undefined?parseFloat(b.deal_price):null,b.image,b.badge,b.is_active!==undefined?(b.is_active?1:0):null,req.params.id]);
if(!r.rows.length)return res.status(404).json({success:false,message:'Deal not found.'});res.json({success:true,message:'Deal updated successfully.',deal:r.rows[0]});}catch(e){res.status(500).json({success:false,message:'Failed to update deal.'});}});
router.delete('/:id',requireAdmin,async(req,res)=>{try{await db.query('DELETE FROM deals WHERE id=$1',[req.params.id]);res.json({success:true,message:'Deal deleted successfully.'});}catch(e){res.status(500).json({success:false,message:'Failed to delete deal.'});}});
module.exports=router;
