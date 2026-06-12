import * as sessionService from '../services/session.service.js';
import { success, error } from '../utils/apiResponse.js';
import { HTTP_STATUS, ERROR_MSG } from '../utils/constants.js';

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
