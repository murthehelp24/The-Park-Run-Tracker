import { Router } from 'express';
import * as sessionController from '../controllers/session.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/sessions/:userId — ดูประวัติการวิ่งทั้งหมดของ User
router.get('/:userId', authenticate, sessionController.getSessionsByUser);

// GET /api/sessions/:sessionId/laps — ดูเวลาแต่ละรอบของ Session
router.get('/:sessionId/laps', authenticate, sessionController.getLapsBySession);

export default router;
