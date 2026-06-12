import { Server } from 'socket.io';

let io;

/**
 * สร้างและตั้งค่า Socket.io instance
 * เรียกใช้ครั้งเดียวตอน server เริ่มทำงาน
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 ผู้ใช้เชื่อมต่อแล้ว:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
    });
  });

  return io;
};

/**
 * ดึง Socket.io instance ที่สร้างไว้แล้ว
 * ใช้ใน Controller เพื่อ emit event
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io ยังไม่ได้เริ่มต้น! เรียก initSocket() ก่อน');
  }
  return io;
};
