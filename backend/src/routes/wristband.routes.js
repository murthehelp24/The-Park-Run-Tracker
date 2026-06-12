import { Router } from 'express';
import * as wristbandController from '../controllers/wristband.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/wristband/assign — ผูกสายรัดข้อมือกับ User (ต้องล็อกอินก่อน)
router.post('/assign', authenticate, wristbandController.assign);

// GET /api/wristband/:userId — ดูสายรัดข้อมือของ User (ต้องล็อกอินก่อน)
router.get('/:userId', authenticate, wristbandController.getByUser);

// DELETE /api/wristband/:uid — ลบสายรัดข้อมือของ User (ต้องล็อกอินก่อน)
router.delete('/:uid', authenticate, wristbandController.remove);

export default router;
