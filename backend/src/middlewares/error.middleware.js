import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Global Error Handler Middleware
 * จับ Error ทั้งหมดที่ถูกส่งมาด้วย next(error) จาก Controller
 * ต้องอยู่หลัง Routes ทั้งหมดใน server.js
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  const message = err.message || 'เกิดข้อผิดพลาดภายในระบบ';

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
