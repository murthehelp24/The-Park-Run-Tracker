import { Router } from 'express';
import * as scanController from '../controllers/scan.controller.js';

const router = Router();

// POST /api/scan — รับข้อมูลจากเครื่องอ่าน NFC
// ไม่ต้อง authenticate เพราะเครื่องอ่าน NFC ส่งมาโดยตรง
router.post('/', scanController.processScan);

export default router;
