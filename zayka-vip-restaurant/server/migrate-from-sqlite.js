const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const db = require('./db');

const sqlitePath = path.join(__dirname, 'data', 'zayka.db');

function copyColumnNames(sqlite, table, columns) {
  const available = new Set(sqlite.prepare('SELECT * FROM pragma_table_info(?)').all(table).map((column) => column.name));
  return columns.filter((column) => available.has(column));
}

async function migrate() {
  if (process.env.CONFIRM_SQLITE_TO_NEON_MIGRATION !== 'YES') {
    throw new Error('Migration blocked: set CONFIRM_SQLITE_TO_NEON_MIGRATION=YES only after approval.');
  }

  if (!fs.existsSync(sqlitePath)) {
    throw new Error(`SQLite source database not found: ${sqlitePath}`);
  }

  await db.initSchema();
  const sqlite = new DatabaseSync(sqlitePath, { readOnly: true });

  const tableColumns = {
    users: ['id', 'name', 'email', 'phone', 'password_hash', 'role', 'provider', 'avatar', 'address', 'created_at'],
    categories: ['id', 'name', 'slug', 'icon', 'sort_order'],
    products: ['id', 'name', 'description', 'price', 'discount_price', 'category_id', 'image', 'is_available', 'is_special', 'is_dessert', 'spicy_level', 'tags', 'created_at'],
    deals: ['id', 'title', 'description', 'items_included', 'original_price', 'deal_price', 'image', 'badge', 'is_active', 'created_at'],
    orders: ['id', 'order_number', 'user_id', 'customer_name', 'customer_email', 'customer_phone', 'order_type', 'address', 'payment_method', 'payment_status', 'subtotal', 'discount', 'delivery_fee', 'total_amount', 'status', 'notes', 'created_at'],
    order_items: ['id', 'order_id', 'product_id', 'product_name', 'price', 'quantity', 'instructions'],
    reservations: ['id', 'reservation_code', 'user_id', 'customer_name', 'customer_email', 'customer_phone', 'guests_count', 'reservation_date', 'reservation_time', 'seating_area', 'special_requests', 'status', 'created_at'],
    reviews: ['id', 'user_id', 'customer_name', 'rating', 'comment', 'is_approved', 'created_at'],
    password_resets: ['id', 'email_or_phone', 'token', 'expires_at', 'used'],
    settings: ['key', 'value']
  };

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    for (const [table, expectedColumns] of Object.entries(tableColumns)) {
      const columns = copyColumnNames(sqlite, table, expectedColumns);
      const rows = sqlite.prepare(`SELECT ${columns.map((column) => `"${column}"`).join(', ')} FROM "${table}"`).all();
      if (!rows.length) continue;

      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
      const conflict = table === 'settings' ? 'key' : 'id';

      for (const row of rows) {
        const values = columns.map((column) => row[column]);
        await client.query(
          `INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(', ')})
           VALUES (${placeholders})
           ON CONFLICT (${conflict}) DO NOTHING`,
          values
        );
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    sqlite.close();
  }

  const counts = {};
  for (const table of Object.keys(tableColumns)) {
    const result = await db.query(`SELECT COUNT(*)::INTEGER AS count FROM "${table}"`);
    counts[table] = result.rows[0].count;
  }

  console.log(JSON.stringify({ migrated: true, source: sqlitePath, counts }, null, 2));
  await db.end();
}

migrate().catch((error) => {
  console.error('SQLite to PostgreSQL migration failed:', error.message);
  process.exit(1);
});
