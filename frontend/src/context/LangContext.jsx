import { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const translations = {
  en: {
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    verifyOTP: 'Verify Code',
    otpSent: 'Verification code sent to your email',
    enterOTP: 'Enter 4-digit code',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    resendOTP: 'Resend Code',
    // Nav
    dashboard: 'Dashboard',
    nutrition: 'Nutrition Plan',
    workout: 'Workout Plan',
    chat: 'Coach Chat',
    store: 'Store',
    avatar: 'My Avatar',
    progress: 'Progress Photos',
    admin: 'Admin Panel',
    logout: 'Logout',
    // Dashboard
    welcome: 'Welcome back',
    tipOfDay: 'Tip of the Day',
    yourPlan: 'Your Plan',
    noStats: "You haven't set up your plan yet",
    setupNow: 'Set Up Now',
    // Stats form
    setupProfile: 'Set Up Your Profile',
    weight: 'Weight (kg)',
    height: 'Height (cm)',
    age: 'Age',
    armMeasurement: 'Arm Measurement (cm)',
    legMeasurement: 'Leg Measurement (cm)',
    waistMeasurement: 'Waist Measurement (cm)',
    workoutsPerWeek: 'Workouts Per Week',
    goal: 'Your Goal',
    bulk: 'Bulk / Mass',
    cut: 'Cut / Shred',
    generatePlan: 'Generate My Plan',
    generating: 'AI is building your plan...',
    // Nutrition
    dailyCalories: 'Daily Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fats: 'Fats',
    meals: 'Meals',
    exportPDF: 'Export PDF',
    // Workout
    workoutA: 'Workout A',
    workoutB: 'Workout B',
    sets: 'Sets',
    reps: 'Reps',
    rest: 'Rest',
    watchVideo: 'Watch Tutorial',
    // Chat
    coachChat: 'Coach Chat',
    chatPlaceholder: 'Ask your coach anything...',
    send: 'Send',
    remaining: 'messages remaining today',
    // Store
    addToCart: 'Add to Cart',
    cart: 'Cart',
    checkout: 'Checkout',
    total: 'Total',
    orderSuccess: 'Order placed! 💪',
    // Avatar
    generateAvatar: 'Generate Avatar',
    uploadPhoto: 'Upload Your Photo',
    avatarReady: 'Your Avatar is Ready!',
    oneTimeOnly: 'One-time generation',
    // Progress
    beforePhoto: 'Before',
    afterPhoto: 'After',
    uploadPhotos: 'Upload Before & After',
    // Common
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
  },
  he: {
    login: 'התחברות',
    register: 'הרשמה',
    email: 'אימייל',
    password: 'סיסמה',
    name: 'שם מלא',
    verifyOTP: 'אימות קוד',
    otpSent: 'קוד אימות נשלח לאימייל שלך',
    enterOTP: 'הזן קוד 4 ספרות',
    noAccount: 'אין לך חשבון?',
    haveAccount: 'כבר יש לך חשבון?',
    resendOTP: 'שלח שוב',
    dashboard: 'לוח בקרה',
    nutrition: 'תפריט תזונה',
    workout: 'תוכנית אימונים',
    chat: 'שיחה עם המאמן',
    store: 'חנות',
    avatar: 'האווטר שלי',
    progress: 'תמונות התקדמות',
    admin: 'ניהול',
    logout: 'התנתקות',
    welcome: 'ברוך הבא',
    tipOfDay: 'טיפ היום',
    yourPlan: 'התוכנית שלך',
    noStats: 'עדיין לא הגדרת את התוכנית שלך',
    setupNow: 'הגדר עכשיו',
    setupProfile: 'הגדרת פרופיל',
    weight: 'משקל (ק"ג)',
    height: 'גובה (ס"מ)',
    age: 'גיל',
    armMeasurement: 'מדידת יד (ס"מ)',
    legMeasurement: 'מדידת רגל (ס"מ)',
    waistMeasurement: 'מדידת קו מותן (ס"מ)',
    workoutsPerWeek: 'אימונים בשבוע',
    goal: 'המטרה שלך',
    bulk: 'מסה',
    cut: 'חיטוב',
    generatePlan: 'צור את התוכנית שלי',
    generating: 'הבינה המלאכותית בונה את התוכנית...',
    dailyCalories: 'קלוריות יומיות',
    protein: 'חלבון',
    carbs: 'פחמימות',
    fats: 'שומנים',
    meals: 'ארוחות',
    exportPDF: 'ייצוא PDF',
    workoutA: 'אימון A',
    workoutB: 'אימון B',
    sets: 'סטים',
    reps: 'חזרות',
    rest: 'מנוחה',
    watchVideo: 'צפה בהדגמה',
    coachChat: 'שיחה עם המאמן',
    chatPlaceholder: 'שאל את המאמן כל שאלה...',
    send: 'שלח',
    remaining: 'הודעות נותרו היום',
    addToCart: 'הוסף לסל',
    cart: 'סל קניות',
    checkout: 'לתשלום',
    total: 'סה"כ',
    orderSuccess: 'ההזמנה בוצעה! 💪',
    generateAvatar: 'צור אווטר',
    uploadPhoto: 'העלה תמונה שלך',
    avatarReady: 'האווטר שלך מוכן!',
    oneTimeOnly: 'יצירה חד פעמית',
    beforePhoto: 'לפני',
    afterPhoto: 'אחרי',
    uploadPhotos: 'העלה תמונות לפני ואחרי',
    save: 'שמור',
    cancel: 'ביטול',
    loading: 'טוען...',
    error: 'משהו השתבש',
    success: 'הצלחה!',
  }
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('pump_lang') || 'he');
  const t = (key) => translations[lang][key] || key;
  const isRTL = lang === 'he';

  const toggleLang = () => {
    const newLang = lang === 'he' ? 'en' : 'he';
    setLang(newLang);
    localStorage.setItem('pump_lang', newLang);
  };

  return (
    <LangContext.Provider value={{ lang, t, isRTL, toggleLang }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
