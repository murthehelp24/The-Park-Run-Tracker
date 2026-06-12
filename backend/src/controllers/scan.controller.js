import * as scanService from '../services/scan.service.js';
import { success, error } from '../utils/apiResponse.js';
import { getIO } from '../config/socket.js';
import { HTTP_STATUS, ERROR_MSG, SUCCESS_MSG } from '../utils/constants.js';

/**
 * POST /api/scan
 * รับข้อมูลจากเครื่องอ่าน NFC — หัวใจหลักของระบบ
 * ทุกครั้งที่นักวิ่งแตะสายรัด จะเรียกเส้นนี้
 */
export const processScan = async (req, res, next) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return error(res, ERROR_MSG.SCAN_UID_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    const result = await scanService.processScan(uid);

    // ส่ง Event ผ่าน Socket.io ไปยัง Frontend
    const io = getIO();

    if (result.type === 'SESSION_STARTED') {
      io.emit('session-started', result);
      return success(res, result, SUCCESS_MSG.SESSION_STARTED, HTTP_STATUS.CREATED);
    }

    if (result.type === 'LAP_RECORDED') {
      io.emit('new-lap', result);
      return success(res, result, SUCCESS_MSG.LAP_RECORDED);
    }
  } catch (err) {
    next(err);
  }
};
