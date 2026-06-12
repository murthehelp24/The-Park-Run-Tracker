/**
 * ส่ง Response สำเร็จ แบบมาตรฐาน
 * @param {object} res - Express Response object
 * @param {any} data - ข้อมูลที่ต้องการส่งกลับ
 * @param {string} message - ข้อความแจ้งผลลัพธ์
 * @param {number} statusCode - HTTP Status Code (default: 200)
 */
export const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * ส่ง Response ผิดพลาด แบบมาตรฐาน
 * @param {object} res - Express Response object
 * @param {string} message - ข้อความแจ้งข้อผิดพลาด
 * @param {number} statusCode - HTTP Status Code (default: 500)
 */
export const error = (res, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
