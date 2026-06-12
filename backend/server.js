import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

// Config
import { initSocket } from './src/config/socket.js';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import wristbandRoutes from './src/routes/wristband.routes.js';
import scanRoutes from './src/routes/scan.routes.js';
import sessionRoutes from './src/routes/session.routes.js';

// Middlewares
import { errorHandler } from './src/middlewares/error.middleware.js';

// โหลดค่าจากไฟล์ .env
dotenv.config();

// ===== สร้าง Express App =====
const app = express();
const httpServer = createServer(app);

// ===== ตั้งค่า Socket.io =====
initSocket(httpServer);

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/wristband', wristbandRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/sessions', sessionRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🏃 Park Run Tracker API is running!' });
});

// ===== Global Error Handler (ต้องอยู่หลัง Routes ทั้งหมด) =====
app.use(errorHandler);

// ===== เริ่มต้น Server =====
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log('');
  console.log('🏃 ════════════════════════════════════════');
  console.log(`   Park Run Tracker API`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log('   ════════════════════════════════════════');
  console.log('');
});
