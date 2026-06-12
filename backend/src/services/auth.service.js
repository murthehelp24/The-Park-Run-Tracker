import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { SALT_ROUNDS, TOKEN_EXPIRY, ERROR_MSG } from '../utils/constants.js';

/**
 * สมัครสมาชิก
 * - ตรวจสอบ email ซ้ำ
 * - เข้ารหัส password ด้วย bcrypt
 * - สร้าง User ในฐานข้อมูล
 */
export const register = async ({ firstName, lastName, email, password }) => {
  // ตรวจสอบว่า email นี้มีคนใช้แล้วหรือยัง
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const err = new Error(ERROR_MSG.EMAIL_ALREADY_EXISTS);
    err.statusCode = 409;
    throw err;
  }

  // เข้ารหัส password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // สร้าง User ใหม่
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * เข้าสู่ระบบ
 * - ค้นหา User จาก email
 * - ตรวจสอบ password ด้วย bcrypt
 * - สร้าง JWT Token
 */
export const login = async ({ email, password }) => {
  // ค้นหา User จาก email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const err = new Error(ERROR_MSG.INVALID_CREDENTIALS);
    err.statusCode = 401;
    throw err;
  }

  // ตรวจสอบ password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const err = new Error(ERROR_MSG.INVALID_CREDENTIALS);
    err.statusCode = 401;
    throw err;
  }

  // สร้าง JWT Token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

/**
 * เข้าสู่ระบบผ่าน Google (ใช้กับ Supabase Auth)
 * - ค้นหา User จาก email หรือสร้างใหม่ถ้ายังไม่มี
 * - สร้าง JWT Token ส่งกลับให้ Frontend
 */
export const googleLogin = async ({ email, firstName, lastName }) => {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // สร้าง User ใหม่พร้อม dummy password
    const dummyPassword = await bcrypt.hash(`google-oauth-dummy-${Math.random()}`, SALT_ROUNDS);
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: dummyPassword,
      },
    });
  }

  // สร้าง JWT Token สำหรับเซสชันของเราเอง
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};
