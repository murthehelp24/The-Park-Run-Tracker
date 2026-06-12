import dayjs from 'dayjs';
import prisma from '../config/db.js';
import { ERROR_MSG } from '../utils/constants.js';

/**
 * ประมวลผลการแตะสายรัดข้อมือ NFC
 * 
 * Logic หลัก:
 * 1. ค้นหาสายรัดจาก UID → หา User
 * 2. เช็คว่ามี Session ที่เปิดอยู่ไหม (endTime === null)
 *    - ไม่มี → สร้าง RunSession ใหม่ (เริ่มวิ่ง)
 *    - มี → บันทึก Lap ใหม่ พร้อมคำนวณเวลา
 */
export const processScan = async (uid, timestamp) => {
  // 1. ค้นหาสายรัดข้อมือ
  const wristband = await prisma.wristband.findUnique({
    where: { uid },
    include: { user: true },
  });

  if (!wristband) {
    const err = new Error(ERROR_MSG.WRISTBAND_NOT_FOUND);
    err.statusCode = 404;
    throw err;
  }

  if (wristband.status === 'INACTIVE') {
    const err = new Error(ERROR_MSG.WRISTBAND_INACTIVE);
    err.statusCode = 400;
    throw err;
  }

  const userId = wristband.userId;
  const now = timestamp ? dayjs(timestamp) : dayjs();

  // 2. ค้นหา Session ที่เปิดอยู่ (endTime === null)
  const activeSession = await prisma.runSession.findFirst({
    where: {
      userId,
      endTime: null,
    },
    include: {
      lapLogs: {
        orderBy: { lapNumber: 'desc' },
        take: 1, // ดึงเฉพาะ Lap ล่าสุด
      },
    },
  });

  // ──────── กรณีไม่มี Session → สร้างใหม่ (เริ่มวิ่ง) ────────
  if (!activeSession) {
    const newSession = await prisma.runSession.create({
      data: {
        userId,
        startTime: now.toDate(),
      },
    });

    return {
      type: 'SESSION_STARTED',
      session: newSession,
      user: {
        id: wristband.user.id,
        firstName: wristband.user.firstName,
        lastName: wristband.user.lastName,
      },
    };
  }

  // ──────── กรณีมี Session อยู่แล้ว → บันทึก Lap ใหม่ ────────

  // คำนวณ lap duration (วินาที)
  const lastLap = activeSession.lapLogs[0]; // Lap ล่าสุด
  const previousTime = lastLap
    ? dayjs(lastLap.scannedAt)
    : dayjs(activeSession.startTime); // ถ้ายังไม่เคยมี Lap → เทียบกับ startTime

  const lapDuration = now.diff(previousTime, 'second');
  const newLapNumber = activeSession.totalLaps + 1;

  // สร้าง LapLog ใหม่ + อัปเดต totalLaps พร้อมกัน
  const [lapLog, updatedSession] = await prisma.$transaction([
    prisma.lapLog.create({
      data: {
        sessionId: activeSession.id,
        wristbandUid: uid,
        lapNumber: newLapNumber,
        scannedAt: now.toDate(),
        lapDuration,
      },
    }),
    prisma.runSession.update({
      where: { id: activeSession.id },
      data: { totalLaps: newLapNumber },
    }),
  ]);

  return {
    type: 'LAP_RECORDED',
    lap: {
      id: lapLog.id.toString(), // BigInt → String สำหรับ JSON
      lapNumber: lapLog.lapNumber,
      lapDuration: lapLog.lapDuration,
      scannedAt: lapLog.scannedAt,
    },
    session: {
      id: updatedSession.id,
      totalLaps: updatedSession.totalLaps,
      startTime: updatedSession.startTime,
    },
    user: {
      id: wristband.user.id,
      firstName: wristband.user.firstName,
      lastName: wristband.user.lastName,
    },
  };
};
