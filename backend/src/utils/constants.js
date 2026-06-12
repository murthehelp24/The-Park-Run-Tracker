// ===== ค่าคงที่สำหรับ Authentication =====
export const SALT_ROUNDS = 10;
export const TOKEN_EXPIRY = '7d'; // JWT หมดอายุใน 7 วัน

// ===== HTTP Status Codes =====
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

// ===== Error Messages =====
export const ERROR_MSG = {
  // Auth
  EMAIL_ALREADY_EXISTS: 'อีเมลนี้ถูกใช้งานแล้ว',
  INVALID_CREDENTIALS: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  TOKEN_REQUIRED: 'กรุณาเข้าสู่ระบบก่อน',
  TOKEN_INVALID: 'Token ไม่ถูกต้องหรือหมดอายุ',

  // User
  USER_NOT_FOUND: 'ไม่พบผู้ใช้งาน',

  // Wristband
  WRISTBAND_ALREADY_EXISTS: 'สายรัดข้อมือนี้ถูกลงทะเบียนแล้ว',
  WRISTBAND_NOT_FOUND: 'ไม่พบสายรัดข้อมือนี้',
  WRISTBAND_INACTIVE: 'สายรัดข้อมือนี้ถูกปิดใช้งานแล้ว',

  // Scan
  SCAN_UID_REQUIRED: 'กรุณาระบุรหัส UID ของสายรัดข้อมือ',

  // Session
  SESSION_NOT_FOUND: 'ไม่พบข้อมูลการวิ่ง',

  // General
  MISSING_FIELDS: 'กรุณากรอกข้อมูลให้ครบถ้วน',
  INTERNAL_SERVER_ERROR: 'เกิดข้อผิดพลาดภายในระบบ',
};

// ===== Success Messages =====
export const SUCCESS_MSG = {
  REGISTER_SUCCESS: 'สมัครสมาชิกสำเร็จ',
  LOGIN_SUCCESS: 'เข้าสู่ระบบสำเร็จ',
  WRISTBAND_ASSIGNED: 'ผูกสายรัดข้อมือสำเร็จ',
  SESSION_STARTED: 'เริ่มรอบการวิ่งใหม่',
  LAP_RECORDED: 'บันทึกรอบวิ่งสำเร็จ',
};
