const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const dealsRoutes = require('./routes/deals');
const ordersRoutes = require('./routes/orders');
const reservationsRoutes = require('./routes/reservations');
const reviewsRoutes = require('./routes/reviews');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;
const { verifyToken } = require('./middleware/auth');
const db = require('./db');
let schemaReady;

async function ensureSchema(req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  try {
    if (!schemaReady) {
      schemaReady = db.initSchema();
    }
    await schemaReady;
    next();
  } catch (error) {
    schemaReady = undefined;
    next(error);
  }
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(verifyToken);
app.use('/api', ensureSchema);

// API Health Check
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status: 'healthy',
      database: 'postgresql',
      platform: 'ZAYKA VIP Restaurant Platform',
      version: '1.0.0',
      time: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'postgresql',
      message: error.message,
      time: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', settingsRoutes);

// Serve static frontend files if built
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.'
  });
});

async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await db.initSchema();
    } else {
      await db.query('SELECT 1');
    }
    app.listen(PORT, () => {
      console.log(`👑 ZAYKA VIP Restaurant Server running on http://localhost:${PORT}`);
      console.log(`   - PostgreSQL REST API endpoints ready at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('PostgreSQL startup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
