# 💪 PumP - Fitness & Nutrition Platform

פלטפורמת כושר ותזונה מתקדמת עם בינה מלאכותית

---

## 🚀 התחלה מהירה (Local Development)

### דרישות מקדימות
- Node.js 18+
- חשבון MongoDB Atlas (חינמי)
- חשבון Resend (חינמי לשליחת מיילים)
- OpenAI API Key

### 1. הגדרת Backend

```bash
cd backend
cp .env.example .env
```

ערוך את `.env` עם הפרטים שלך:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pump
JWT_SECRET=your-secret-key-here-make-it-long-and-random
OPENAI_API_KEY=sk-proj-your-key-here
RESEND_API_KEY=re_your-resend-key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=Yuvalboker588@gmail.com
CLIENT_URL=http://localhost:5173
```

```bash
npm install
npm run dev
```

### 2. הגדרת Frontend

```bash
cd frontend
cp .env.example .env
# .env כבר מוכן עם localhost
npm install
npm run dev
```

### 3. פתח בדפדפן
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## 📦 Seed Products לחנות

לאחר כניסה כ-Admin, שלח POST request ל:
```
POST /api/store/seed
Authorization: Bearer <your-admin-token>
```

או השתמש ב-Postman/Thunder Client.

---

## 🌐 פריסה ל-Render

### Backend (Web Service)
1. Push לGitHub
2. צור Web Service ב-Render
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. הוסף Environment Variables מה-.env

### Frontend (Static Site)
1. צור Static Site ב-Render
2. Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. הוסף: `VITE_API_URL=https://your-backend-url.onrender.com/api`

---

## 🔧 טכנולוגיות

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Resend (Email)
- OpenAI API
- Sharp (Image Processing)
- Multer (File Upload)

**Frontend:**
- React + Vite
- TailwindCSS
- Zustand (State)
- React Router
- Axios
- jsPDF + html2canvas
- Lucide Icons

---

## 👑 Admin

- **Email:** Yuvalboker588@gmail.com
- **Password:** Yuval2000
- Admin panel: `/admin`

---

## 🎯 פיצ'רים

1. ✅ רישום והתחברות עם OTP דו-שלבי
2. ✅ תפריט תזונה מותאם אישית (OpenAI)
3. ✅ תוכנית אימונים A/B (OpenAI)
4. ✅ ייצוא PDF לתפריט ואימון
5. ✅ שיחה עם מאמן AI (3 הודעות/יום)
6. ✅ חנות אונליין עם סל קניות
7. ✅ יצירת אווטר AI (חד פעמי)
8. ✅ תמונות לפני ואחרי
9. ✅ Tip of the Day (30 טיפים)
10. ✅ Admin Panel
11. ✅ דו-לשוני (עברית + אנגלית)
12. ✅ עיצוב ספורטיבי מרשים

---

## ⚠️ הערות חשובות

- **API Key:** לעולם אל תחשוף את ה-OpenAI API key בקוד ציבורי
- **MongoDB:** השתמש ב-Atlas עם הרשאות IP whitelist מתאימות
- **Resend:** צור domain ב-Resend לשליחת מיילים מדומיין אמיתי
