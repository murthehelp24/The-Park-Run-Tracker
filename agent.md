# 🗺️ Agent — ลำดับขั้นตอนการพัฒนา The Park Run Tracker

> เอกสารอธิบายลำดับขั้นตอน (Phases) ในการพัฒนาระบบ The Park Run Tracker ทั้งหมด
> แบ่งเป็น **6 เฟสหลัก** เรียงตามลำดับก่อน-หลัง พร้อมอธิบายรายละเอียดแต่ละขั้นตอน

---

## 📊 ภาพรวมทุกเฟส

```
Phase 1        Phase 2        Phase 3        Phase 4        Phase 5        Phase 6
วางแผน    ──►  ฐานข้อมูล  ──►  Backend   ──►  Frontend  ──►  เชื่อมต่อ  ──►  ทดสอบ
& ออกแบบ       & Prisma        API            React          Real-time      & Deploy
```

| เฟส | ชื่อ | สถานะ | รายละเอียดโดยย่อ |
|-----|------|-------|-----------------|
| 1 | วางแผนและออกแบบระบบ | ✅ เสร็จแล้ว | วิเคราะห์ความต้องการ, ออกแบบ ER Diagram, เลือก Tech Stack |
| 2 | ตั้งค่าฐานข้อมูลและ Prisma | ✅ เสร็จแล้ว | สร้าง Schema, Migration, ทดสอบการเชื่อมต่อ PostgreSQL |
| 3 | พัฒนา Backend API | ✅ เสร็จแล้ว | สร้าง Express Server, เขียน API ทั้งหมด, ระบบ Auth |
| 4 | พัฒนา Frontend (React) | ✅ เสร็จแล้ว | สร้างหน้าจอทั้งหมด, ระบบ Routing, เรียก API |
| 5 | เชื่อมต่อ Real-time (Socket.io) | ✅ เสร็จแล้ว | เชื่อม Frontend-Backend แบบ Real-time |
| 6 | ทดสอบ, แก้บัก และ Deploy | ⏳ กำลังดำเนินการ | ทดสอบทุกฟีเจอร์, แก้บัก, เตรียม Deploy |

---

## 🔷 Phase 1 — วางแผนและออกแบบระบบ (Planning & Design)

### 📌 เป้าหมาย
กำหนดขอบเขตของโปรเจค, ออกแบบโครงสร้างข้อมูล, และเลือกเทคโนโลยีที่เหมาะสม ก่อนลงมือเขียนโค้ดจริง

### 📝 งานที่ต้องทำ

#### 1.1 วิเคราะห์ความต้องการ (Requirement Analysis)
- กำหนด **ฟีเจอร์หลัก** ของระบบ:
  - ระบบสมัครสมาชิก / ล็อกอิน (Authentication)
  - ระบบผูกสายรัดข้อมือ NFC กับบัญชีผู้ใช้
  - ระบบรับข้อมูลจากเครื่องอ่าน NFC และคำนวณเวลารอบวิ่ง
  - Dashboard แสดงผลเวลาวิ่งแบบ Real-time
  - หน้าประวัติการวิ่ง (Run History)
- กำหนด **ผู้ใช้งาน (Actors)**: นักวิ่ง (Runner), เครื่องอ่าน NFC (NFC Reader)
- กำหนด **ขอบเขต**: เว็บแอปที่ปรับขนาดหน้าจอให้ดูเหมือนเปิดบนมือถือ (Mobile-first responsive)

#### 1.2 ออกแบบฐานข้อมูล (Database Design)
- สร้าง **ER Diagram** ระบุความสัมพันธ์ระหว่างตาราง:
  - `Users` ↔ `Wristbands` — ความสัมพันธ์ **1:N** (ผู้ใช้ 1 คน มีสายรัดได้หลายเส้น)
  - `Users` ↔ `RunSessions` — ความสัมพันธ์ **1:N** (ผู้ใช้ 1 คน วิ่งได้หลายครั้ง)
  - `RunSessions` ↔ `LapLogs` — ความสัมพันธ์ **1:N** (การวิ่ง 1 ครั้ง มีหลายรอบ)
  - `Wristbands` ↔ `LapLogs` — ความสัมพันธ์ **1:N** (สายรัด 1 เส้น แตะได้หลายรอบ)
- กำหนด **Primary Key, Foreign Key, Index** ที่เหมาะสม

#### 1.3 เลือก Tech Stack
- ตัดสินใจเลือกเทคโนโลยีตามหลัก **Basic & Clean Code**:
  - Frontend: React (Vite) + React Router Dom + Socket.io-client + Tailwind CSS
  - Backend: Express.js + Socket.io + JWT + bcrypt + Day.js + dotenv
  - Database: PostgreSQL + Prisma ORM
  - Package Manager: pnpm
  - Module System: ES Modules (`"type": "module"`)

#### 1.4 วางโครงสร้างโปรเจค
- สร้างโฟลเดอร์ `backend/` และ `frontend/`
- กำหนดโครงสร้างไฟล์และ Naming Convention

### ✅ ผลลัพธ์ที่ได้
- เอกสาร Tech Stack (readme.md ฉบับเดิม)
- ER Diagram ที่ออกแบบเสร็จ
- โครงสร้างโฟลเดอร์โปรเจค

---

## 🔷 Phase 2 — ตั้งค่าฐานข้อมูลและ Prisma (Database & ORM Setup)

### 📌 เป้าหมาย
สร้างฐานข้อมูล PostgreSQL, เขียน Prisma Schema ตาม ER Diagram, และทดสอบว่าทุกอย่างเชื่อมต่อกันได้

### 📝 งานที่ต้องทำ

#### 2.1 ตั้งค่า Backend โปรเจค
```bash
cd backend
pnpm init
pnpm add express @prisma/client socket.io bcrypt jsonwebtoken dotenv dayjs cors
pnpm add -D prisma nodemon
```
- เพิ่ม `"type": "module"` ใน `package.json` เพื่อใช้ ES Modules
- ตั้งค่า scripts: `"dev": "nodemon server.js"` และ `"start": "node server.js"`

#### 2.2 สร้าง Prisma Schema
- เขียนไฟล์ `prisma/schema.prisma` ที่ประกอบด้วย 4 Model:

  **Model `User`** — ตารางผู้ใช้:
  - `id` (Auto-increment PK), `firstName`, `lastName`, `email` (unique), `password`, `createdAt`
  - Relations: มี `wristbands[]` และ `runSessions[]`

  **Model `Wristband`** — ตารางสายรัดข้อมือ:
  - `uid` (NFC UID เป็น PK), `userId` (FK → User), `status` (ACTIVE/INACTIVE), `assignedAt`
  - Relations: เชื่อมกับ `user` และมี `lapLogs[]`

  **Model `RunSession`** — ตารางรอบการวิ่ง:
  - `id` (Auto-increment PK), `userId` (FK → User), `startTime`, `endTime` (nullable), `totalLaps`
  - Relations: เชื่อมกับ `user` และมี `lapLogs[]`
  - Index: `userId` เพื่อค้นหาประวัติได้เร็ว

  **Model `LapLog`** — ตารางบันทึกแต่ละรอบ:
  - `id` (BigInt Auto-increment PK), `sessionId` (FK → RunSession), `wristbandUid` (FK → Wristband)
  - `lapNumber`, `scannedAt`, `lapDuration` (วินาที)
  - Index: `sessionId` เพื่อดึงข้อมูลรอบต่างๆ ได้เร็ว

#### 2.3 กำหนดค่า Environment
- สร้างไฟล์ `.env`:
  ```env
  DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/park_run_tracker?schema=public"
  JWT_SECRET="your-secret-key"
  PORT=3000
  ```

#### 2.4 Migration & Generate
```bash
pnpm exec prisma migrate dev --name init    # สร้างตารางในฐานข้อมูล
pnpm exec prisma generate                    # สร้าง Prisma Client
```

#### 2.5 ทดสอบการเชื่อมต่อ
- เขียนสคริปต์ทดสอบง่ายๆ เพื่อตรวจสอบว่า Prisma เชื่อมต่อ PostgreSQL ได้สำเร็จ
- ทดลอง Create / Read ข้อมูลเบื้องต้น

### ✅ ผลลัพธ์ที่ได้
- ไฟล์ `schema.prisma` พร้อม 4 ตาราง + Relations + Indexes
- ฐานข้อมูล PostgreSQL ที่มีตารางพร้อมใช้งาน
- `package.json` พร้อม Dependencies ทั้งหมด

---

## 🔷 Phase 3 — พัฒนา Backend API (Backend Development)

### 📌 เป้าหมาย
สร้าง Express.js Server พร้อม API Endpoints ทั้งหมดที่ต้องใช้ ครอบคลุมระบบ Authentication, การจัดการสายรัดข้อมือ, การรับข้อมูลจากเครื่องอ่าน NFC, และการดูประวัติการวิ่ง

### 📝 งานที่ต้องทำ

#### 3.0 จัดโครงสร้างโฟลเดอร์ Backend (Folder Structure)
> ⚠️ **สำคัญ** — แยกโค้ดออกเป็นโฟลเดอร์ตาม Layer เพื่อให้โค้ดเป็นระเบียบ อ่านง่าย และดูแลรักษาได้สะดวก

```
backend/
├── server.js                  # Entry point — ตั้งค่า Express, HTTP Server, Socket.io
├── prisma/
│   └── schema.prisma          # Prisma Schema (จาก Phase 2)
├── src/
│   ├── config/
│   │   ├── db.js              # สร้างและ Export PrismaClient instance
│   │   └── socket.js          # ตั้งค่าและ Export Socket.io instance
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT Authentication middleware
│   │   └── error.middleware.js # Global Error Handler middleware
│   ├── routes/
│   │   ├── auth.routes.js     # เส้นทาง /api/auth/*
│   │   ├── wristband.routes.js# เส้นทาง /api/wristband/*
│   │   ├── scan.routes.js     # เส้นทาง /api/scan
│   │   └── session.routes.js  # เส้นทาง /api/sessions/*
│   ├── controllers/
│   │   ├── auth.controller.js     # Logic รับ Request/Response สำหรับ Auth
│   │   ├── wristband.controller.js# Logic รับ Request/Response สำหรับ Wristband
│   │   ├── scan.controller.js     # Logic รับ Request/Response สำหรับ NFC Scan
│   │   └── session.controller.js  # Logic รับ Request/Response สำหรับ History
│   ├── services/
│   │   ├── auth.service.js        # Business Logic สำหรับ Auth (hash, token, etc.)
│   │   ├── wristband.service.js   # Business Logic สำหรับ Wristband
│   │   ├── scan.service.js        # Business Logic สำหรับ NFC Scan + คำนวณรอบวิ่ง
│   │   └── session.service.js     # Business Logic สำหรับ History
│   └── utils/
│       ├── apiResponse.js     # Helper สำหรับส่ง Response แบบมาตรฐาน
│       └── constants.js       # ค่าคงที่ต่างๆ เช่น Error Messages, Status Codes
├── .env
└── package.json
```

**หลักการแยก Layer:**
| Layer | หน้าที่ | ตัวอย่าง |
|-------|---------|---------|
| **Routes** | กำหนดเส้นทาง URL → Controller | `router.post('/register', authController.register)` |
| **Controllers** | รับ `req, res` → เรียก Service → ส่ง Response | รับข้อมูลจาก body, เรียก service, ส่ง JSON กลับ |
| **Services** | Business Logic ทั้งหมด → เรียก Prisma | hash password, สร้าง token, คำนวณ lap duration |
| **Middlewares** | ตรวจสอบก่อนเข้า Controller | ตรวจ JWT Token, จัดการ Error ส่วนกลาง |
| **Config** | ตั้งค่าและ Export instances | PrismaClient, Socket.io |
| **Utils** | Helper functions ที่ใช้ร่วมกัน | Format response, ค่าคงที่ |

#### 3.1 สร้าง Config Files

**`src/config/db.js`** — สร้าง Prisma Client instance:
```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;
```

**`src/config/socket.js`** — ตั้งค่า Socket.io:
```javascript
import { Server } from 'socket.io';
let io;
export const initSocket = (httpServer) => {
  io = new Server(httpServer, { cors: { origin: '*' } });
  return io;
};
export const getIO = () => io;
```

#### 3.2 สร้าง Express Server (server.js)
```javascript
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './src/config/socket.js';

// Import Routes
import authRoutes from './src/routes/auth.routes.js';
import wristbandRoutes from './src/routes/wristband.routes.js';
import scanRoutes from './src/routes/scan.routes.js';
import sessionRoutes from './src/routes/session.routes.js';

// Import Middlewares
import { errorHandler } from './src/middlewares/error.middleware.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);

app.use(cors());
app.use(express.json());

// ใช้ Routes
app.use('/api/auth', authRoutes);
app.use('/api/wristband', wristbandRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/sessions', sessionRoutes);

// Global Error Handler (ต้องอยู่หลังสุด)
app.use(errorHandler);
```
- แยก Route ออกจาก server.js → Import เข้ามาใช้
- ตั้งค่า Express + HTTP Server + Socket.io
- เชื่อมต่อ Prisma Client ผ่าน config/db.js

#### 3.3 สร้าง API — Authentication (ระบบยืนยันตัวตน)

**ไฟล์ที่เกี่ยวข้อง:** `auth.routes.js` → `auth.controller.js` → `auth.service.js`

**`POST /api/auth/register`** — สมัครสมาชิก:
1. **Route** (`auth.routes.js`): กำหนดเส้นทาง `router.post('/register', authController.register)`
2. **Controller** (`auth.controller.js`): รับ `req.body` → เรียก `authService.register(data)` → ส่ง Response
3. **Service** (`auth.service.js`):
   - รับข้อมูล `firstName`, `lastName`, `email`, `password`
   - ตรวจสอบว่า email ซ้ำหรือไม่ (`prisma.user.findUnique()`)
   - เข้ารหัสรหัสผ่านด้วย `bcrypt.hash(password, 10)`
   - บันทึกลงฐานข้อมูล (`prisma.user.create()`)
   - Return ผลลัพธ์กลับไป Controller

**`POST /api/auth/login`** — ล็อกอิน:
1. **Route** (`auth.routes.js`): กำหนดเส้นทาง `router.post('/login', authController.login)`
2. **Controller** (`auth.controller.js`): รับ `req.body` → เรียก `authService.login(data)` → ส่ง Token
3. **Service** (`auth.service.js`):
   - รับ `email`, `password`
   - ค้นหาผู้ใช้จาก email (`prisma.user.findUnique()`)
   - ตรวจสอบรหัสผ่านด้วย `bcrypt.compare(password, user.password)`
   - สร้าง JWT Token ด้วย `jwt.sign({ userId: user.id }, JWT_SECRET)`
   - Return Token กลับไป Controller

#### 3.4 สร้าง API — Wristband (ระบบสายรัดข้อมือ)

**ไฟล์ที่เกี่ยวข้อง:** `wristband.routes.js` → `wristband.controller.js` → `wristband.service.js`

**`POST /api/wristband/assign`** — ผูกสายรัดกับผู้ใช้:
1. **Route**: `router.post('/assign', authenticate, wristbandController.assign)`
2. **Controller**: รับ `req.body` → เรียก `wristbandService.assign(uid, userId)` → ส่ง Response
3. **Service**:
   - รับ `uid` (รหัส NFC) และ `userId`
   - ตรวจสอบว่ามี User อยู่จริง
   - สร้างข้อมูลสายรัดใหม่ (`prisma.wristband.create()`)
   - ตั้ง status = `ACTIVE`

**`GET /api/wristband/:userId`** — ดูสายรัดข้อมือของผู้ใช้:
1. **Route**: `router.get('/:userId', authenticate, wristbandController.getByUser)`
2. **Controller**: รับ `req.params.userId` → เรียก `wristbandService.getByUser(userId)` → ส่ง Response
3. **Service**: ค้นหาสายรัดทั้งหมดของ userId (`prisma.wristband.findMany()`)

#### 3.5 สร้าง API — NFC Scan (หัวใจหลักของระบบ)

**ไฟล์ที่เกี่ยวข้อง:** `scan.routes.js` → `scan.controller.js` → `scan.service.js`

**`POST /api/scan`** — รับข้อมูลจากเครื่องอ่าน NFC:
> นี่คือ **เส้น API สำคัญที่สุด** ของระบบ — ทำงานทุกครั้งที่นักวิ่งแตะสายรัดที่จุดเช็กพอยท์

1. **Route**: `router.post('/', scanController.processScan)`
2. **Controller**: รับ `req.body.uid` → เรียก `scanService.processScan(uid)` → ส่ง Response + emit Socket
3. **Service** (`scan.service.js`):
```
ลำดับการทำงาน:
1. รับ UID ของสายรัดที่แตะ
2. ค้นหาว่าสายรัดนี้เป็นของ User คนไหน
3. ตรวจสอบว่ามี Session วิ่งที่เปิดอยู่หรือไม่
   ├── ❌ ไม่มี → สร้าง RunSession ใหม่ (แตะครั้งแรก = เริ่มวิ่ง)
   └── ✅ มี → บันทึก Lap ใหม่
       a. คำนวณ lapDuration = เวลาปัจจุบัน - เวลาแตะครั้งก่อน (ใช้ Day.js)
       b. สร้าง LapLog (prisma.lapLog.create())
       c. อัปเดต totalLaps ใน RunSession (+1)
       d. Return ข้อมูลรอบวิ่งกลับไป Controller
```
4. **Controller**: หลังจากได้ผลจาก Service → ใช้ `getIO().emit('new-lap', data)` ส่งไป Frontend

#### 3.6 สร้าง API — History (ประวัติการวิ่ง)

**ไฟล์ที่เกี่ยวข้อง:** `session.routes.js` → `session.controller.js` → `session.service.js`

**`GET /api/sessions/:userId`** — ดูประวัติการวิ่งทั้งหมด:
- **Route** → **Controller** → **Service**: ดึง RunSession ทั้งหมดของผู้ใช้ เรียงจากล่าสุด

**`GET /api/sessions/:sessionId/laps`** — ดูเวลาแต่ละรอบ:
- **Route** → **Controller** → **Service**: ดึง LapLog ทั้งหมดของ Session นั้น เรียงตาม lapNumber

#### 3.7 สร้าง Middlewares

**`src/middlewares/auth.middleware.js`** — JWT Authentication:
- ตรวจสอบ JWT Token ใน Header `Authorization: Bearer <token>`
- ถ้า Token ถูกต้อง → ใส่ `req.user = decoded` แล้วเรียก `next()`
- ถ้า Token ไม่ถูกต้อง → ส่ง 401 Unauthorized

**`src/middlewares/error.middleware.js`** — Global Error Handler:
- รับ Error จากทุก Route ที่โยนมาด้วย `next(error)`
- ส่ง Error Response แบบมาตรฐาน (HTTP Status Code + ข้อความ)

#### 3.8 สร้าง Utils

**`src/utils/apiResponse.js`** — Helper สำหรับส่ง Response:
```javascript
export const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const error = (res, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message, data: null });
};
```

**`src/utils/constants.js`** — ค่าคงที่:
- Error Messages ต่างๆ
- ค่าคงที่ที่ใช้ร่วมกัน เช่น `TOKEN_EXPIRY`, `SALT_ROUNDS`

#### 3.9 จัดการ Error Handling
- ใน Controller ใช้ `try-catch` → เรียก `next(error)` เพื่อส่งไป Global Error Handler
- ส่ง Error Response ที่อ่านเข้าใจง่าย (HTTP Status Code + ข้อความภาษาไทย/อังกฤษ)

### ✅ ผลลัพธ์ที่ได้
- โครงสร้างโฟลเดอร์ Backend ที่แยก Layer ชัดเจน (Routes → Controllers → Services)
- `server.js` ที่ทำหน้าที่เป็น Entry Point เท่านั้น (ไม่มี Logic ปนอยู่)
- ระบบ Authentication ด้วย JWT + bcrypt (แยก Service)
- API สำหรับรับข้อมูล NFC scan พร้อมคำนวณเวลารอบวิ่ง (แยก Service)
- Middleware สำหรับ Auth และ Error Handling
- Utils สำหรับ Response format มาตรฐาน
- Socket.io ส่ง Event เมื่อมีรอบวิ่งใหม่ (ผ่าน config/socket.js)

---

## 🔷 Phase 4 — พัฒนา Frontend (Frontend Development)

### 📌 เป้าหมาย
สร้างเว็บแอปด้วย React (Vite) ที่มีหน้าจอครบถ้วน ปรับขนาดหน้าจอให้ดูดีบนมือถือ พร้อมเรียก API จาก Backend

### 📝 งานที่ต้องทำ

#### 4.1 สร้างโปรเจค React ด้วย Vite
```bash
cd frontend
pnpm create vite . --template react
pnpm install
pnpm add react-router-dom socket.io-client axios
```

#### 4.2 ตั้งค่า Routing (React Router Dom)
```
/login          → หน้าล็อกอิน
/register       → หน้าสมัครสมาชิก
/dashboard      → หน้า Dashboard (หน้าหลัก)
/history        → หน้าประวัติการวิ่ง
/history/:id    → หน้ารายละเอียดรอบวิ่ง
```

#### 4.3 สร้างหน้าจอ — Login Page
- ฟอร์มล็อกอิน: อีเมล + รหัสผ่าน
- เรียก `POST /api/auth/login`
- เก็บ JWT Token ไว้ใน localStorage
- ล็อกอินสำเร็จ → Redirect ไปหน้า Dashboard

#### 4.4 สร้างหน้าจอ — Register Page
- ฟอร์มสมัครสมาชิก: ชื่อ + นามสกุล + อีเมล + รหัสผ่าน
- เรียก `POST /api/auth/register`
- สมัครสำเร็จ → Redirect ไปหน้า Login

#### 4.5 สร้างหน้าจอ — Dashboard (หน้าหลัก) ⭐
> หน้าจอสำคัญที่สุดของแอป — แสดงข้อมูลวิ่ง Real-time

- แสดง **สถานะการวิ่งปัจจุบัน** (กำลังวิ่ง / ไม่ได้วิ่ง)
- แสดง **รอบวิ่งล่าสุด** พร้อมเวลา (อัปเดตอัตโนมัติผ่าน Socket.io)
- แสดง **จำนวนรอบรวม** ที่วิ่งได้ใน Session ปัจจุบัน
- แสดง **เวลารวมตั้งแต่เริ่มวิ่ง**
- ออกแบบ UI ให้มีธีมสปอร์ต สีสันสดใส อ่านง่ายขณะวิ่ง

#### 4.6 สร้างหน้าจอ — History Page
- แสดงรายการ Session การวิ่งทั้งหมด เรียงจากล่าสุด
- แต่ละรายการแสดง: วันที่, จำนวนรอบ, เวลารวม
- กดเข้าไปดูรายละเอียด → แสดงเวลาแต่ละรอบ

#### 4.7 ตกแต่ง UI / Styling
- ใช้ **Tailwind CSS** หรือ CSS ปกติ
- ออกแบบให้เป็น **Mobile-first** (ปรับขนาดหน้าจอให้ดูเหมือนเปิดบนมือถือ)
- สีธีมสปอร์ต (เช่น เขียว, ส้ม, ขาว)
- มี Loading State และ Error State สำหรับทุกหน้า

### ✅ ผลลัพธ์ที่ได้
- React App พร้อมหน้าจอ 4-5 หน้า
- ระบบ Routing ครบถ้วน
- เรียก API จาก Backend ได้ทุกเส้น
- UI ที่ดูดีบนมือถือ พร้อมธีมสปอร์ต

---

## 🔷 Phase 5 — เชื่อมต่อ Real-time (Socket.io Integration)

### 📌 เป้าหมาย
เชื่อมต่อ Frontend กับ Backend ผ่าน Socket.io เพื่อให้หน้า Dashboard แสดงข้อมูลเวลาวิ่งแบบ Real-time โดยไม่ต้อง Refresh หน้า

### 📝 งานที่ต้องทำ

#### 5.1 ตั้งค่า Socket.io ฝั่ง Backend
```javascript
// ใน server.js
io.on('connection', (socket) => {
  console.log('ผู้ใช้เชื่อมต่อแล้ว:', socket.id);

  socket.on('disconnect', () => {
    console.log('ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
  });
});
```
- เมื่อ API `/api/scan` ได้รับข้อมูลจากเครื่องอ่าน NFC → `io.emit('new-lap', lapData)`
- ส่ง Event `session-started` เมื่อเริ่ม Session ใหม่

#### 5.2 ตั้งค่า Socket.io ฝั่ง Frontend
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// รอรับข้อมูลรอบวิ่งใหม่
socket.on('new-lap', (lapData) => {
  // อัปเดต Dashboard ทันที
  setLatestLap(lapData);
  setTotalLaps(prev => prev + 1);
});
```

#### 5.3 ทดสอบ Real-time Flow
1. เปิดหน้า Dashboard บน Browser
2. ส่ง Request ไปที่ `POST /api/scan` (จำลองการแตะสายรัด)
3. ตรวจสอบว่า Dashboard อัปเดตข้อมูลโดยไม่ต้อง Refresh

#### 5.4 จัดการ Connection State
- แสดงสถานะการเชื่อมต่อ (🟢 Connected / 🔴 Disconnected)
- จัดการ Reconnection อัตโนมัติเมื่อหลุด

### ✅ ผลลัพธ์ที่ได้
- Dashboard แสดงข้อมูลวิ่ง Real-time ทันทีที่แตะสายรัด
- ตัวบ่งชี้สถานะการเชื่อมต่อ
- ระบบ Reconnection อัตโนมัติ

---

## 🔷 Phase 6 — ทดสอบ, แก้บัก และ Deploy (Testing, Bug Fixes & Deployment)

### 📌 เป้าหมาย
ทดสอบระบบทั้งหมดแบบ End-to-End, แก้บักที่พบ, ปรับแต่งประสิทธิภาพ, และเตรียมระบบสำหรับ Deploy

### 📝 งานที่ต้องทำ

#### 6.1 ทดสอบ End-to-End (E2E Testing)
ทดสอบ Flow ทั้งหมดตั้งแต่ต้นจนจบ:

```
สมัครสมาชิก → ล็อกอิน → ผูกสายรัด → แตะสายรัดครั้งแรก (เริ่ม Session)
→ แตะรอบที่ 2 → แตะรอบที่ 3 → ... → ดูผล Real-time บน Dashboard
→ ดูประวัติวิ่ง
```

#### 6.2 ทดสอบ Edge Cases
- แตะสายรัดที่ยังไม่ได้ผูกกับ User → ควรแจ้ง Error
- แตะสายรัดที่สถานะ INACTIVE → ควรแจ้ง Error
- ล็อกอินด้วยรหัสผ่านผิด → ควรแจ้ง Error
- สมัครด้วย Email ซ้ำ → ควรแจ้ง Error
- Token หมดอายุ → ควรให้ล็อกอินใหม่

#### 6.3 ทดสอบ Performance
- ทดสอบการส่งข้อมูลผ่าน Socket.io ว่าเร็วพอหรือไม่
- ตรวจสอบว่า Index ใน Database ช่วยให้ Query เร็วขึ้นจริง
- ทดสอบกรณีที่มีผู้ใช้หลายคนเชื่อมต่อพร้อมกัน

#### 6.4 แก้บัก (Bug Fixes)
- แก้ไขปัญหาที่พบจากการทดสอบ
- ตรวจสอบ Error Handling ว่าครบถ้วน
- ตรวจสอบ CORS, Authentication middleware

#### 6.5 ปรับแต่ง UI/UX
- ปรับ Responsive Design ให้ดูดีทุกขนาดหน้าจอ
- เพิ่ม Loading Spinner, Success/Error Toast
- ปรับ Animation และ Transition ให้ลื่นไหล

#### 6.6 เตรียม Deploy
- ตั้งค่า Environment Variables สำหรับ Production
- Build Frontend: `pnpm build`
- เตรียม Database สำหรับ Production
- (Optional) Deploy ขึ้น Cloud (Vercel, Railway, Render ฯลฯ)

### ✅ ผลลัพธ์ที่ได้
- ระบบทำงานได้ครบทุกฟีเจอร์ไม่มีบัก
- UI/UX ลื่นไหล ดูดีบนมือถือ
- พร้อมสำหรับการ Demo / ส่งงาน

---

## 📊 สรุป Dependencies ทั้งหมด

### Backend (`backend/package.json`)

| Package | ประเภท | ใช้ในเฟส |
|---------|--------|---------|
| `express` | Production | Phase 3 |
| `@prisma/client` | Production | Phase 2-3 |
| `socket.io` | Production | Phase 3, 5 |
| `bcrypt` | Production | Phase 3 |
| `jsonwebtoken` | Production | Phase 3 |
| `dotenv` | Production | Phase 2-3 |
| `dayjs` | Production | Phase 3 |
| `cors` | Production | Phase 3 |
| `prisma` | DevDependency | Phase 2 |
| `nodemon` | DevDependency | Phase 3+ |

### Frontend (จะติดตั้งใน Phase 4)

| Package | ประเภท | ใช้ในเฟส |
|---------|--------|---------|
| `react` | Production | Phase 4 |
| `react-dom` | Production | Phase 4 |
| `react-router-dom` | Production | Phase 4 |
| `socket.io-client` | Production | Phase 5 |
| `axios` | Production | Phase 4 |

---

## 🏁 หมายเหตุ

- โปรเจคนี้เน้นการเขียนโค้ดแบบ **Basic & Clean Code** — ไม่มีท่ายาก อ่านง่าย เหมาะสำหรับสร้างต้นแบบ (Prototype)
- ทุก Phase สามารถทำ **ทดสอบเบื้องต้น** ได้ก่อนจะไปเฟสถัดไป เพื่อให้มั่นใจว่าระบบทำงานถูกต้อง
- หากต้องการ Deploy จริง ควรเพิ่ม **Rate Limiting**, **Input Validation**, และ **HTTPS** ใน Phase 6

---

<p align="center">
  📌 เอกสารนี้จะอัปเดตตามสถานะการพัฒนาจริง
</p>
