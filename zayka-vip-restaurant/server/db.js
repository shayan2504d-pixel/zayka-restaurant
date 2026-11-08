require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.POSTGRES_URL
  || process.env.DATABASE_URL
  || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    isProduction
      ? 'POSTGRES_URL, DATABASE_URL, or NEON_DATABASE_URL is required in production.'
      : 'DATABASE_URL is required for local development.'
  );
}

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === 'true'
    || (isProduction && !connectionString.includes('localhost'))
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password_hash TEXT,
      role TEXT DEFAULT 'customer',
      provider TEXT DEFAULT 'local',
      avatar TEXT,
      address TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC NOT NULL,
      discount_price NUMERIC,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      image TEXT,
      is_available INTEGER DEFAULT 1,
      is_special INTEGER DEFAULT 0,
      is_dessert INTEGER DEFAULT 0,
      spicy_level INTEGER DEFAULT 0,
      tags TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      items_included TEXT,
      original_price NUMERIC NOT NULL,
      deal_price NUMERIC NOT NULL,
      image TEXT,
      badge TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      order_type TEXT DEFAULT 'delivery',
      address TEXT,
      payment_method TEXT DEFAULT 'cod',
      payment_status TEXT DEFAULT 'pending',
      subtotal NUMERIC NOT NULL,
      discount NUMERIC DEFAULT 0,
      delivery_fee NUMERIC DEFAULT 0,
      total_amount NUMERIC NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT,
      product_name TEXT NOT NULL,
      price NUMERIC NOT NULL,
      quantity INTEGER NOT NULL,
      instructions TEXT
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      reservation_code TEXT UNIQUE NOT NULL,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      guests_count INTEGER NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      seating_area TEXT DEFAULT 'Standard',
      special_requests TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      is_approved INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      email_or_phone TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      used INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

pool.initSchema = initSchema;
module.exports = pool;
