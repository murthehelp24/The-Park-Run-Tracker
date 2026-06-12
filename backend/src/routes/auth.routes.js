import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/register — สมัครสมาชิก
router.post('/register', authController.register);

// POST /api/auth/login — เข้าสู่ระบบ
router.post('/login', authController.login);

// POST /api/auth/google — เข้าสู่ระบบผ่าน Google
router.post('/google', authController.googleLogin);

export default router;
