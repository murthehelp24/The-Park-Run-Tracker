import jwt from 'jsonwebtoken';
import { error } from '../utils/apiResponse.js';
import { HTTP_STATUS, ERROR_MSG } from '../utils/constants.js';

/**
 * Middleware ตรวจสอบ JWT Token
 * ดึง Token จาก Header: Authorization: Bearer <token>
 * ถ้าถูกต้อง → ใส่ข้อมูล user ลงใน req.user แล้วไปต่อ
 * ถ้าไม่ถูกต้อง → ส่ง 401 Unauthorized
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, ERROR_MSG.TOKEN_REQUIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ใส่ข้อมูล user ลงใน request เพื่อให้ Controller ใช้งานได้
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, ERROR_MSG.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);
  }
};
