import * as wristbandService from '../services/wristband.service.js';
import { success, error } from '../utils/apiResponse.js';
import { HTTP_STATUS, ERROR_MSG, SUCCESS_MSG } from '../utils/constants.js';

/**
 * POST /api/wristband/assign
 * ผูกสายรัดข้อมือกับ User
 */
export const assign = async (req, res, next) => {
  try {
    const { uid, userId } = req.body;

    if (!uid || !userId) {
      return error(res, ERROR_MSG.MISSING_FIELDS, HTTP_STATUS.BAD_REQUEST);
    }

    const wristband = await wristbandService.assign(uid, parseInt(userId));
    return success(res, wristband, SUCCESS_MSG.WRISTBAND_ASSIGNED, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/wristband/:userId
 * ดึงรายการสายรัดข้อมือทั้งหมดของ User
 */
export const getByUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return error(res, ERROR_MSG.MISSING_FIELDS, HTTP_STATUS.BAD_REQUEST);
    }

    const wristbands = await wristbandService.getByUser(userId);
    return success(res, wristbands);
  } catch (err) {
    next(err);
  }
};
