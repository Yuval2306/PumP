import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useLang } from '../context/LangContext';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login | register | otp
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLogin, setIsLoginOTP] = useState(false);
  const { login, register, verifyOTP, loading } = useAuthStore();
  const { t, toggleLang, lang } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(form.email, form.password);
      if (res.success) {
        setUserId(res.userId);
        setIsLoginOTP(true);
        setMode('otp');
        toast.success(t('otpSent'));
      } else toast.error(t('error'));
    } else {
      const res = await register(form.name, form.email, form.password);
      if (res.success) {
        setUserId(res.userId);
        setIsLoginOTP(false);
        setMode('otp');
        toast.success(t('otpSent'));
      } else toast.error(t('error'));
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const res = await verifyOTP(userId, otp, isLogin);
    if (res.success) {
      toast.success('ברוך הבא ל-PumP! 💪');
      navigate('/dashboard');
    } else toast.error('קוד שגוי, נסה שוב');
  };

  const handleResend = async () => {
    await api.post('/auth/resend-otp', { userId });
    toast.success(t('otpSent'));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF6B35] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF4500] opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Lang toggle */}
      <button onClick={toggleLang} className="absolute top-6 right-6 text-[#888] hover:text-white transition-colors text-sm font-medium">
        {lang === 'he' ? 'EN' : 'עב'}
      </button>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/PumP_logo.png" alt="PumP" className="h-32 object-contain mx-auto" />

        </div>

        {mode === 'otp' ? (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 animate-fade-up">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-2xl font-bold">{t('verifyOTP')}</h2>
              <p className="text-[#888] text-sm mt-2">{t('otpSent')}</p>
            </div>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                placeholder={t('enterOTP')}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="input-field text-center text-3xl tracking-widest font-bold"
                required
              />
              <button type="submit" disabled={loading} className="btn-primary w-full text-center">
                {loading ? t('loading') : t('verifyOTP')}
              </button>
              <button type="button" onClick={handleResend} className="w-full text-[#888] hover:text-[#FF6B35] text-sm transition-colors">
                {t('resendOTP')}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 animate-fade-up">
            <div className="flex gap-2 mb-8 bg-black rounded-xl p-1">
              {['login', 'register'].map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF4500] text-white' : 'text-[#888] hover:text-white'}`}>
                  {m === 'login' ? t('login') : t('register')}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <input type="text" placeholder={t('name')} value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field" required />
              )}
              <input type="email" placeholder={t('email')} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" required />
              <input type="password" placeholder={t('password')} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field" required />
              <button type="submit" disabled={loading} className="btn-primary w-full text-center">
                {loading ? t('loading') : mode === 'login' ? t('login') : t('register')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
