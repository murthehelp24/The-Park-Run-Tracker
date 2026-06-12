import * as sessionService from '../services/session.service.js';
import { success, error } from '../utils/apiResponse.js';
import { HTTP_STATUS, ERROR_MSG } from '../utils/constants.js';
import { getIO } from '../config/socket.js';

/**
 * GET /api/sessions/:userId
 * ดูประวัติการวิ่งทั้งหมดของ User
 */
export const getSessionsByUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return error(res, ERROR_MSG.MISSING_FIELDS, HTTP_STATUS.BAD_REQUEST);
    }

    const sessions = await sessionService.getSessionsByUser(userId);
    return success(res, sessions);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sessions/:sessionId/laps
 * ดูเวลาแต่ละรอบของ Session
 */
export const getLapsBySession = async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.sessionId);

    if (isNaN(sessionId)) {
      return error(res, ERROR_MSG.MISSING_FIELDS, HTTP_STATUS.BAD_REQUEST);
    }

    const result = await sessionService.getLapsBySession(sessionId);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/sessions/active/finish
 * บันทึกจบเซสชันการวิ่งที่กำลังรันอยู่ของผู้ใช้งานที่ล็อกอิน
 */
export const finishActiveSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const session = await sessionService.finishActiveSession(userId);

    // ส่ง Event แจ้งเตือนการจบเซสชันวิ่งไปยัง Socket.io
    const io = getIO();
    io.emit('session-finished', { userId, session });

    return success(res, session, 'บันทึกประวัติการวิ่งเรียบร้อยแล้ว');
  } catch (err) {
    next(err);
  }
};
