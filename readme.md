# 🏃 The Park Run Tracker

> ระบบติดตามการวิ่งในสวนสาธารณะแบบ Real-time ด้วยสายรัดข้อมือ NFC

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.14-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4.7-010101?logo=socket.io&logoColor=white)](https://socket.io/)

---

## 📋 สารบัญ

- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)
- [สถาปัตยกรรมระบบ](#-สถาปัตยกรรมระบบ-3-tier-architecture)
- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [โครงสร้างฐานข้อมูล](#-โครงสร้างฐานข้อมูล-er-diagram)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [วิธีติดตั้งและรันโปรเจค](#-วิธีติดตั้งและรันโปรเจค)
- [API Endpoints](#-api-endpoints)
- [หลักการเขียนโค้ด](#-หลักการเขียนโค้ด)

---

## 🎯 ภาพรวมโปรเจค

**The Park Run Tracker** คือระบบเว็บแอปพลิเคชันสำหรับติดตามการวิ่งในสวนสาธารณะ โดยใช้ **สายรัดข้อมือ NFC** เป็นตัวระบุตัวตนนักวิ่ง ระบบจะบันทึกเวลาวิ่งแต่ละรอบ (Lap) แบบ **Real-time** ผ่านเครื่องอ่าน NFC ที่จุดเช็กพอยท์ และแสดงผลบนหน้าจอเว็บทันที

### ✨ ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| 🔐 **สมัครสมาชิก / ล็อกอิน** | ระบบยืนยันตัวตนด้วย JWT Token พร้อมเข้ารหัสรหัสผ่านด้วย bcrypt |
| 📱 **สายรัดข้อมือ NFC** | ผูกสายรัดข้อมือ NFC กับบัญชีผู้ใช้ สำหรับระบุตัวตนขณะวิ่ง |
| ⏱️ **บันทึกเวลาวิ่งอัตโนมัติ** | เมื่อแตะสายรัดที่เครื่องอ่าน NFC ระบบจะคำนวณเวลาแต่ละรอบอัตโนมัติ |
| 📡 **Real-time Dashboard** | แสดงข้อมูลเวลารอบวิ่งล่าสุดบนหน้าจอทันทีผ่าน Socket.io |
| 📊 **ประวัติการวิ่ง** | ดูย้อนหลังผลการวิ่งทุกครั้ง จำนวนรอบ และเวลาแต่ละรอบ |

### 🔄 Flow การทำงานหลัก

```
นักวิ่งแตะสายรัด NFC ──► เครื่องอ่านส่งข้อมูล UID ──► Backend รับข้อมูล
       │                                                      │
       │                                               คำนวณ Lap Time
       │                                                      │
       ▼                                                      ▼
  วิ่งรอบต่อไป ◄──────── หน้าจอ Dashboard อัปเดต ◄──── Socket.io ส่ง Real-time
```

---

## 🏗️ สถาปัตยกรรมระบบ (3-Tier Architecture)

โปรเจคนี้ออกแบบตามรูปแบบ **3-Tier Architecture** แบ่งชัดเจนเป็น 3 ชั้น:

```
┌─────────────────────────────────────────────────────────┐
│              📱 Presentation Tier (Frontend)            │
│         React (Vite) + Socket.io-client + CSS           │
│         React Router Dom + Tailwind CSS                 │
├─────────────────────────────────────────────────────────┤
│              ⚙️ Application Tier (Backend API)          │
│     Express.js + Socket.io + JWT + bcrypt + Day.js      │
├─────────────────────────────────────────────────────────┤
│              💾 Data Tier (Database)                    │
│           PostgreSQL + Prisma ORM                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ เทคโนโลยีที่ใช้

### Tier 1 — Presentation (Frontend)

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|-----------|---------|--------|
| **React (Vite)** | Latest | ตัวเริ่มต้นโปรเจกต์หน้าบ้าน สร้าง UI แยกหน้าจอและคอมโพเนนต์ |
| **React Router Dom** | Latest | ระบบเปลี่ยนหน้า (Login → Dashboard → History) |
| **Socket.io-client** | Latest | รับข้อมูลเวลารอบวิ่งแบบ Real-time จาก Backend |
| **CSS / Tailwind CSS** | Latest | ตกแต่ง UI ให้เป็นธีมสปอร์ต |

### Tier 2 — Application (Backend)

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|-----------|---------|--------|
| **Express.js** | `^4.19.2` | เฟรมเวิร์ค API หลังบ้าน จัดการ Routes ทั้งหมด |
| **Socket.io** | `^4.7.5` | ส่งข้อมูลเวลารอบวิ่งไปยัง Frontend แบบ Real-time |
| **bcrypt** | `^5.1.1` | เข้ารหัสและตรวจสอบรหัสผ่าน |
| **jsonwebtoken (JWT)** | `^9.0.2` | สร้าง Token ยืนยันตัวตนผู้ใช้งาน |
| **Day.js** | `^1.11.10` | คำนวณเวลาแต่ละรอบวิ่ง (เวลาปัจจุบัน ลบ เวลาสแกนรอบก่อนหน้า) |
| **dotenv** | `^16.4.5` | จัดการตัวแปร Environment (.env) |
| **cors** | `^2.8.5` | อนุญาต Cross-Origin Requests จาก Frontend |

### Tier 3 — Data

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|-----------|---------|--------|
| **PostgreSQL** | v15+ | ฐานข้อมูลหลัก เก็บข้อมูลเป็นตารางตาม ER Diagram |
| **Prisma ORM** | `^5.14.0` | จัดการฐานข้อมูลด้วยคำสั่งที่อ่านง่าย เช่น `prisma.user.create()` |

### Dev Tools

| เครื่องมือ | หน้าที่ |
|-----------|--------|
| **pnpm** | Package Manager — ติดตั้งเร็ว ประหยัดพื้นที่ |
| **nodemon** | Auto-restart เซิร์ฟเวอร์เมื่อมีการแก้ไขโค้ด |
| **Prisma CLI** | จัดการ Migration และ Generate Client |

---

## 💾 โครงสร้างฐานข้อมูล (ER Diagram)

ระบบมี **4 ตารางหลัก** ที่เชื่อมโยงกัน:

```
┌──────────────┐       ┌──────────────────┐
│    Users     │       │   Wristbands     │
│──────────────│       │──────────────────│
│ id (PK)      │◄──┐   │ uid (PK)         │
│ first_name   │   └──│ user_id (FK)     │
│ last_name    │       │ status           │
│ email        │       │ assigned_at      │
│ password     │       └────────┬─────────┘
│ created_at   │                │
└──────┬───────┘                │
       │                        │
       │ 1:N                    │ 1:N
       ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│  Run Sessions    │    │    Lap Logs      │
│──────────────────│    │──────────────────│
│ id (PK)          │◄──│ session_id (FK)  │
│ user_id (FK)     │    │ wristband_uid(FK)│
│ start_time       │    │ lap_number       │
│ end_time         │    │ scanned_at       │
│ total_laps       │    │ lap_duration     │
└──────────────────┘    └──────────────────┘
```

### รายละเอียดตาราง

#### 1. `users` — ข้อมูลผู้ใช้งาน
- เก็บข้อมูลสมัครสมาชิก (ชื่อ, อีเมล, รหัสผ่านแบบเข้ารหัส)
- เชื่อมโยงไปยังตาราง `wristbands` และ `run_sessions`

#### 2. `wristbands` — สายรัดข้อมือ NFC
- ใช้ `uid` ของชิป NFC เป็น Primary Key
- ผูกกับผู้ใช้ (user_id) และมีสถานะ `ACTIVE` / `INACTIVE`

#### 3. `run_sessions` — รอบการวิ่ง
- บันทึกแต่ละครั้งที่นักวิ่งมาวิ่ง (เวลาเริ่ม, เวลาจบ, จำนวนรอบรวม)
- แตะสายรัดครั้งแรก = เริ่ม Session ใหม่

#### 4. `lap_logs` — บันทึกแต่ละรอบ
- บันทึกทุกครั้งที่แตะสายรัดผ่านจุดเช็กพอยท์
- เก็บหมายเลขรอบ, เวลาที่แตะ, และระยะเวลาวิ่งรอบนั้น (วินาที)

---

## 📁 โครงสร้างโปรเจค

```
The Park Run Tracker/
├── 📄 readme.md                     # เอกสารอธิบายโปรเจค
├── 📄 agent.md                      # ขั้นตอนการพัฒนาระบบ (Phases)
│
├── 📂 backend/                      # ฝั่งหลังบ้าน (API Server)
│   ├── 📄 .env                      # ตัวแปร Environment (DATABASE_URL, JWT_SECRET)
│   ├── 📄 package.json              # Dependencies และ Scripts
│   ├── 📄 pnpm-lock.yaml            # Lock file ของ pnpm
│   ├── 📄 pnpm-workspace.yaml       # การตั้งค่า Workspace
│   ├── 📄 server.js                 # Entry point ของ API Server (Express + Socket.io)
│   ├── 📂 prisma/
│   │   └── 📄 schema.prisma         # โครงสร้างฐานข้อมูล (4 ตาราง)
│   └── 📂 node_modules/             # Dependencies ที่ติดตั้งแล้ว
│
└── 📂 frontend/                     # ฝั่งหน้าบ้าน (React Web App)
    └── (ยังไม่ได้สร้าง — รอ Phase ถัดไป)
```

---

## 🚀 วิธีติดตั้งและรันโปรเจค

### ข้อกำหนดเบื้องต้น (Prerequisites)

- **Node.js** v18 ขึ้นไป
- **pnpm** (ติดตั้ง: `npm install -g pnpm`)
- **PostgreSQL** v15 ขึ้นไป (ต้องสร้าง Database ก่อน)

### ขั้นตอนติดตั้ง

```bash
# 1. Clone โปรเจค
git clone <repository-url>
cd "The Park Run Tracker"

# 2. เข้าโฟลเดอร์ Backend
cd backend

# 3. ติดตั้ง Dependencies
pnpm install

# 4. สร้างไฟล์ .env และกำหนดค่า
#    สร้างไฟล์ .env ในโฟลเดอร์ backend แล้วเพิ่มค่าต่อไปนี้:
```

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/park_run_tracker?schema=public"

# JWT
JWT_SECRET="your-super-secret-key"

# Server
PORT=3000
```

```bash
# 5. สร้างตารางในฐานข้อมูล (Prisma Migration)
pnpm exec prisma migrate dev --name init

# 6. Generate Prisma Client
pnpm exec prisma generate

# 7. รันเซิร์ฟเวอร์ (Development Mode)
pnpm dev
```

### Scripts ที่ใช้ได้

| Script | คำสั่ง | คำอธิบาย |
|--------|--------|---------|
| `dev` | `pnpm dev` | รันเซิร์ฟเวอร์ด้วย nodemon (auto-restart) |
| `start` | `pnpm start` | รันเซิร์ฟเวอร์แบบ Production |

---

## 📡 API Endpoints

> **หมายเหตุ:** API Endpoints ด้านล่างเป็นแนวทางตามโครงสร้างฐานข้อมูล — จะถูกสร้างขึ้นจริงในเฟสถัดไป

### 🔐 Authentication

| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| `POST` | `/api/auth/register` | สมัครสมาชิก (ชื่อ, อีเมล, รหัสผ่าน) |
| `POST` | `/api/auth/login` | ล็อกอิน (ได้รับ JWT Token) |

### 📱 Wristband

| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| `POST` | `/api/wristband/assign` | ผูกสายรัดข้อมือกับบัญชีผู้ใช้ |
| `GET` | `/api/wristband/:userId` | ดูสายรัดข้อมือของผู้ใช้ |

### ⏱️ Run Session & Lap

| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| `POST` | `/api/scan` | รับข้อมูลจากเครื่องอ่าน NFC (สร้าง Session / บันทึก Lap) |
| `GET` | `/api/sessions/:userId` | ดูประวัติการวิ่งทั้งหมดของผู้ใช้ |
| `GET` | `/api/sessions/:sessionId/laps` | ดูเวลาแต่ละรอบของ Session นั้น |

### 📡 Real-time Events (Socket.io)

| Event | ทิศทาง | คำอธิบาย |
|-------|--------|---------|
| `new-lap` | Server → Client | ส่งข้อมูลรอบวิ่งใหม่ไปแสดงบน Dashboard |
| `session-started` | Server → Client | แจ้งว่าเริ่ม Session วิ่งใหม่แล้ว |

---

## 📑 หลักการเขียนโค้ด

โปรเจคนี้เน้นการเขียนโค้ดแบบ **Basic & Clean Code** — ตรงไปตรงมา อ่านง่าย แก้ไขง่าย:

### 1. 🧱 ไม่ซ้อนฟังก์ชันซับซ้อน (No Over-engineering)
- ใช้ `try-catch` บล็อกธรรมดา อ่านจากบนลงล่าง
- ไม่มีโครงสร้าง Class ที่ยุ่งยาก
- เขียนลอจิกเป็นเส้นตรง (Linear Logic)

### 2. 🏷️ ตั้งชื่อตัวแปรตรงๆ (Semantic Naming)
```javascript
const activeSession = await prisma.runSession.findFirst({ ... });
const lastLapTime = dayjs(lastLap.scannedAt);
const currentScanTime = dayjs();
```

### 3. 💬 มี Comment ภาษาไทยกำกับชัดเจน
```javascript
// ค้นหา Session ที่ยังเปิดอยู่ของนักวิ่งคนนี้
const activeSession = await prisma.runSession.findFirst({
  where: { userId: user.id, endTime: null }
});
```

### 4. 📦 ใช้ ES Modules
```javascript
import express from 'express';
import { PrismaClient } from '@prisma/client';
```

---

## 📄 License

โปรเจคนี้จัดทำขึ้นเพื่อการศึกษา (Educational Purpose)

---

<p align="center">
  สร้างด้วย ❤️ สำหรับโปรเจค Park Run Tracker
</p>
