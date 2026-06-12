# 🏃 The Park Run Tracker - Frontend Design & Stitch Prompts (Simple Orange Theme)

เอกสารนี้รวบรวมแนวทางการออกแบบอินเตอร์เฟสและ **คำสั่ง Prompt สำหรับ Stitch** เพื่อสร้างหน้าจอทั้ง 5 หน้าในธีม **Simple & Sporty Orange (สปอร์ต เรียบง่าย สบายตา สีส้มอบอุ่น)** โดยปรับปรุงลดความฉูดฉาดลง เน้นการใช้งานที่ง่ายเป็นหลัก (Easy to Use)

---

## 🎨 Theme & Styling Guidelines (คู่มือการคุมโทนใหม่)
*   **Color Mode:** Premium Dark Slate (`#0f172a` หรือ `#1e293b`) ให้โทนสีที่สปอร์ต ทันสมัย แต่ดูสุขุมและสบายตากว่าสีดำสนิท
*   **Primary Accent:** Warm Orange (`#f97316` หรือ `#ea580c`) - สีส้มโทนอบอุ่นและสะอาดตา ใช้สำหรับปุ่มดำเนินการหลักและหัวข้อเด่น ไม่สะท้อนแสงจนแสบตา
*   **Supporting Color:** Light Gray & Slate Gray (`#64748b` / `#94a3b8`) - ใช้สำหรับกรอบข้อมูลและข้อความย่อย เพื่อให้เลย์เอาท์ดูคลีนและสบายตา
*   **Visual Style:** Simple Clean Elements - เน้นการใช้บล็อกสี่เหลี่ยมขอบมนปกติ (`rounded-md` หรือ `8px`) เส้นกรอบบางๆ ไม่ซับซ้อน และเน้นพื้นที่ว่าง (Whitespace)
*   **Typography:** Inter (สำหรับตัวหนังสือและสถิติต่างๆ อ่านง่าย ชัดเจน)

---

## 📋 รายละเอียดหน้าจอและ Prompts สำหรับส่งให้ Stitch

### 1. หน้าเข้าสู่ระบบ (Login Page)
*   **รายละเอียด:** หน้าจอเข้าสู่ระบบแบบเรียบง่าย พื้นหลังสีเทาเข้มโทนน้ำเงินปานกลาง (Dark Slate) มีกล่องล็อกอินสีเทาอ่อนสะอาดตาขอบมนบาง ปุ่มกดสีส้มคลาสสิกที่เด่นชัดแต่ไม่สะท้อนแสง
*   **Stitch Tool Call (JSON):**
    ```json
    {
      "projectId": "16063393093291204595",
      "deviceType": "MOBILE",
      "prompt": "Create a clean, simple mobile login screen for 'The Park Run Tracker'. Dark slate gray background (#0f172a) that is clean and modern. In the center, a simple container card with a thin gray border. Inside, place a clean logo 'Park Run Tracker' with a simple orange running icon. Input fields for 'Email' and 'Password' are minimalist with clean white backgrounds, dark gray text, and a 1px border that turns warm orange (#f97316) on focus. The primary sign-in button is a solid Warm Orange (#f97316) with bold white text. Below the button, add simple text links for 'Register' and 'Forgot Password' in light gray."
    }
    ```

### 2. หน้าสมัครสมาชิก (Register Page)
*   **รายละเอียด:** ฟอร์มสมัครสมาชิกที่กรอกง่าย ไม่ลายตา มีคำอธิบายสั้นๆ เกี่ยวกับการผูกสายรัดข้อมือ NFC ที่สามารถทำภายหลังได้
*   **Stitch Tool Call (JSON):**
    ```json
    {
      "projectId": "16063393093291204595",
      "deviceType": "MOBILE",
      "prompt": "Create a simple mobile registration screen for 'The Park Run Tracker'. Dark slate background (#0f172a). Clean header with a simple back arrow and the title 'Create Account'. Features neat and spaced input fields for 'First Name', 'Last Name', 'Email', 'Password', and 'NFC Wristband UID (Optional)' with a helpful hint text below it. All text fields have a 1px border. The sign-up button is a clean, solid warm orange (#f97316) button with bold white text. At the bottom, a link to 'Already have an account? Log In' in light gray."
    }
    ```

### 3. หน้าแดชบอร์ดหลัก (Real-time Dashboard Page)
*   **รายละเอียด:** หน้าแสดงการวิ่งปัจจุบันแบบเรียลไทม์ เน้นความเรียบง่ายและมองเห็นชัดเจนขณะวิ่ง วงกลมรอบปัจจุบันสีส้มเรียบๆ ตัวจับเวลาบอกนาทีและวินาทีที่ชัดเจน ตารางแสดงสถิติรอบข้างล่างเป็นสี่เหลี่ยมคลีนๆ
*   **Stitch Tool Call (JSON):**
    ```json
    {
      "projectId": "16063393093291204595",
      "deviceType": "MOBILE",
      "prompt": "Create a simple and highly legible mobile running dashboard for 'The Park Run Tracker'. Clean dark slate background (#0f172a). Top header has user avatar, 'Hello, Somchai', and a neat badge showing '🟢 Connected' and 'NFC Active'. The main section displays a clean, minimalist orange outline circle showing the current lap count ('Lap 5') and a large, clear stopwatch timer '02:14' in bold white. Below the circle, a simple 2x2 card layout displays metrics: 'Total Time' (11:42), 'Est. Distance' (2.0 km), 'Last Lap' (02:18 in orange), and 'Avg Lap' (02:20). Below the metrics, a clean table labeled 'Recent Lap Splits' lists previous laps with simple gray rows: Lap 4 (02:18), Lap 3 (02:22), Lap 2 (02:25)."
    }
    ```

### 4. หน้าประวัติการวิ่ง (Running History Page)
*   **รายละเอียด:** หน้าแสดงสถิติย้อนหลังในรูปแบบการ์ดเรียงต่อกัน แยกข้อมูลเป็นสัดส่วนชัดเจน การสรุปสถิติรายเดือนด้านบนเรียบง่ายไม่วุ่นวาย
*   **Stitch Tool Call (JSON):**
    ```json
    {
      "projectId": "16063393093291204595",
      "deviceType": "MOBILE",
      "prompt": "Create a simple mobile history screen for 'The Park Run Tracker'. Dark slate theme. Title 'Run History'. At the top, a simple gray summary box with a thin orange accent line showing: '15 Runs', '120 Laps', and '8h 45m' in clear bold text. Below this, a vertical list of past sessions. Each session card is a simple dark gray block showing the date 'June 12, 2026', total time '45:12', and a small orange pill badge with '12 Laps'. Cards are expandable to show a clean list of lap times and durations."
    }
    ```

### 5. หน้าโปรไฟล์และการตั้งค่า (Profile & Settings Page)
*   **รายละเอียด:** หน้าจัดการข้อมูลผู้ใช้และผูกอุปกรณ์ NFC ที่จัดวางปุ่มแก้ไขอย่างชัดเจน และหน้าสถิติสูงสุดส่วนบุคคลที่ออกแบบคลีนๆ
*   **Stitch Tool Call (JSON):**
    ```json
    {
      "projectId": "16063393093291204595",
      "deviceType": "MOBILE",
      "prompt": "Create a clean mobile profile and settings screen for 'The Park Run Tracker'. Dark slate background (#0f172a). Profile header shows runner avatar and name 'Somchai'. The page has three clean sections. Section 1 is 'Wristband ID' showing 'NFC: 8A:7B:9C:1D' with a simple orange button 'Change Device'. Section 2 is 'Personal Bests' listing 'Fastest Lap: 01:58' and 'Longest Run: 18 Laps' in a simple grid. Section 3 contains settings lists: 'Edit Profile' and 'Notifications'. At the bottom, a simple outlined Sign Out button in orange."
    }
    ```

---

## 🚀 วิธีนำคำสั่งไปใช้งาน
1. **ให้ Antigravity ช่วยรันผ่านเครื่องมือ (อัตโนมัติ):** คุณสามารถสั่งให้ผมเรียกใช้คำสั่งเหล่านี้ทีละหน้าได้เลย เพียงแค่ตอบกลับว่า *"ช่วยสร้างหน้า [ชื่อหน้า] ด้วย Stitch เลย"*
2. **นำไปวางในช่องป้อนคำสั่งของ Stitch (ทำเอง):** คุณสามารถก๊อปปี้ข้อความภาษาอังกฤษในส่วนหัวข้อ `"prompt"` ของแต่ละหน้าจอไปวางในกล่องเครื่องมือ Stitch ของคุณได้โดยตรง
