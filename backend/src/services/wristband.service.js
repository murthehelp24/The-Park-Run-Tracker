import prisma from '../config/db.js';
import { ERROR_MSG } from '../utils/constants.js';

/**
 * ผูกสายรัดข้อมือ NFC กับ User
 * - ตรวจสอบว่ามี User อยู่จริง
 * - ตรวจสอบว่า UID นี้ยังไม่ถูกลงทะเบียน
 * - สร้าง Wristband record
 */
export const assign = async (uid, userId) => {
  // ตรวจสอบว่ามี User อยู่จริง
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const err = new Error(ERROR_MSG.USER_NOT_FOUND);
    err.statusCode = 404;
    throw err;
  }

  // ตรวจสอบว่า UID นี้ยังไม่เคยถูกลงทะเบียน
  const existingWristband = await prisma.wristband.findUnique({
    where: { uid },
  });

  if (existingWristband) {
    const err = new Error(ERROR_MSG.WRISTBAND_ALREADY_EXISTS);
    err.statusCode = 409;
    throw err;
  }

  // สร้าง Wristband ใหม่
  const wristband = await prisma.wristband.create({
    data: {
      uid,
      userId,
      status: 'ACTIVE',
    },
  });

  return wristband;
};

/**
 * ดึงรายการสายรัดข้อมือทั้งหมดของ User
 */
export const getByUser = async (userId) => {
  const wristbands = await prisma.wristband.findMany({
    where: { userId },
    orderBy: { assignedAt: 'desc' },
  });

  return wristbands;
};

/**
 * ลบสายรัดข้อมือ NFC ของ User
 */
export const deleteWristband = async (uid, userId) => {
  // ตรวจสอบว่าสายรัดมีอยู่จริงและเป็นของ User คนนี้
  const wristband = await prisma.wristband.findUnique({
    where: { uid },
  });

  if (!wristband) {
    const err = new Error('ไม่พบสายรัดข้อมือนี้');
    err.statusCode = 404;
    throw err;
  }

  if (wristband.userId !== userId) {
    const err = new Error('ไม่มีสิทธิ์ลบสายรัดข้อมือนี้');
    err.statusCode = 403;
    throw err;
  }

  // ลบข้อมูล lap logs ที่อ้างอิงสายรัดนี้ก่อน ป้องกันปัญหา Foreign Key error
  await prisma.lapLog.deleteMany({
    where: { wristbandUid: uid },
  });

  // ลบสายรัดข้อมือ
  await prisma.wristband.delete({
    where: { uid },
  });

  return { uid };
};
