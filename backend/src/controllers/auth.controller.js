import * as authService from '../services/auth.service.js';
import { success, error } from '../utils/apiResponse.js';
import { HTTP_STATUS, ERROR_MSG, SUCCESS_MSG } from '../utils/constants.js';

/**
 * POST /api/auth/register
 * สมัครสมาชิก
 */
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // ตรวจสอบว่ากรอกข้อมูลครบหรือยัง
    if (!firstName || !lastName || !email || !password) {
      return error(res, ERROR_MSG.MISSING_FIELDS, HTTP_STATUS.BAD_REQUEST);
    }

    const user = await authService.register({ firstName, lastName, email, password });
    return success(res, user, SUCCESS_MSG.REGISTER_SUCCESS, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * เข้าสู่ระบบ
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่ากรอกข้อมูลครบหรือยัง
    if (!email || !password) {
      return error(res, ERROR_MSG.MISSING_FIELDS, HTTP_STATUS.BAD_REQUEST);
    }

    const result = await authService.login({ email, password });
    return success(res, result, SUCCESS_MSG.LOGIN_SUCCESS);
  } catch (err) {
    next(err);
  }
};
