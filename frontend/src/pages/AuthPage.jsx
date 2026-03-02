import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useLang } from '../context/LangContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, register, loading } = useAuthStore();
  const { t, toggleLang, lang } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(form.email, form.password);
      if (res.success) {
        toast.success('ברוך הבא ל-PumP! 💪');
        navigate('/dashboard');
      } else toast.error(t('error'));
    } else {
      const res = await register(form.name, form.email, form.password);
      if (res.success) {
        toast.success('ברוך הבא ל-PumP! 💪');
        navigate('/dashboard');
      } else toast.error(t('error'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF6B35] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF4500] opacity-5 rounded-full blur-3xl" />
      </div>

      <button onClick={toggleLang} className="absolute top-6 right-6 text-[#888] hover:text-white transition-colors text-sm font-medium">
        {lang === 'he' ? 'EN' : 'עב'}
      </button>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <img src="/PumP_logo.png" alt="PumP" className="h-32 object-contain mx-auto" />
        </div>

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
      </div>
    </div>
  );
}