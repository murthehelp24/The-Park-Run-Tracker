import prisma from '../config/db.js';
import { ERROR_MSG } from '../utils/constants.js';

/**
 * ดึงประวัติการวิ่งทั้งหมดของ User
 * เรียงจากล่าสุดไปเก่าสุด
 */
export const getSessionsByUser = async (userId) => {
  const sessions = await prisma.runSession.findMany({
    where: { userId },
    orderBy: { startTime: 'desc' },
    include: {
      _count: {
        select: { lapLogs: true },
      },
    },
  });

  return sessions;
};

/**
 * ดึงข้อมูลเวลาแต่ละรอบของ Session
 * เรียงตาม lapNumber จากน้อยไปมาก
 */
export const getLapsBySession = async (sessionId) => {
  // ตรวจสอบว่า Session มีอยู่จริง
  const session = await prisma.runSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    const err = new Error(ERROR_MSG.SESSION_NOT_FOUND);
    err.statusCode = 404;
    throw err;
  }

  const laps = await prisma.lapLog.findMany({
    where: { sessionId },
    orderBy: { lapNumber: 'asc' },
  });

  // แปลง BigInt id เป็น String เพื่อให้ JSON.stringify ทำงานได้
  const formattedLaps = laps.map((lap) => ({
    ...lap,
    id: lap.id.toString(),
  }));

  return {
    session,
    laps: formattedLaps,
  };
};

/**
 * บันทึกจบการวิ่งของ User (อัปเดต endTime)
 */
export const finishActiveSession = async (userId) => {
  const activeSession = await prisma.runSession.findFirst({
    where: {
      userId,
      endTime: null,
    },
  });

  if (!activeSession) {
    const err = new Error('ไม่พบเซสชันการวิ่งที่กำลังทำงานอยู่');
    err.statusCode = 404;
    throw err;
  }

  const updatedSession = await prisma.runSession.update({
    where: { id: activeSession.id },
    data: {
      endTime: new Date(),
    },
  });

  return updatedSession;
};
