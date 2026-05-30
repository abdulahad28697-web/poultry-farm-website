import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import flockRoutes from './routes/flockRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { ensureDefaultAdmin } from './utils/ensureDefaultAdmin.js';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: false
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/flock-records', flockRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/health-mgmt', healthRoutes);

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  await ensureDefaultAdmin();

  app.listen(env.port, () => {
    console.log(`Backend API running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend server', error);
  process.exit(1);
});
