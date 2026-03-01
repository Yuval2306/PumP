import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lightbulb, Dumbbell, UtensilsCrossed, MessageCircle, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { user, refreshUser } = useAuthStore();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    weight: '', height: '', age: '', armMeasurement: '',
    legMeasurement: '', waistMeasurement: '', workoutsPerWeek: 3, goal: 'bulk'
  });

  useEffect(() => {
    fetchTip();
    if (!user?.stats) setShowSetup(true);
  }, []);

  const fetchTip = async () => {
    try {
      const { data } = await api.get('/user/tip');
      setTip(data.tip);
    } catch {}
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await api.post('/user/stats', form);
      await refreshUser();
      setShowSetup(false);
      toast.success('התוכנית שלך מוכנה! 🎉');
    } catch (err) {
      toast.error(t('error'));
    } finally {
      setGenerating(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-[#888] text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          {t('welcome')}, <span style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span>! 💪
        </h1>
        <p className="text-[#888] mt-1">{user?.stats?.goal === 'bulk' ? '🏋️ Bulk Mode' : '🔥 Cut Mode'}</p>
      </div>

      {/* Tip of the Day */}
      {tip && (
        <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35] opacity-5 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF4500] rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[#FF6B35] font-bold text-sm mb-2 uppercase tracking-wider">{t('tipOfDay')}</p>
              <p className="text-white font-medium">{lang === 'he' ? tip.he : tip.en}</p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Form */}
      {showSetup && (
        <div className="bg-[#111] border border-[#FF6B35] rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{t('setupProfile')}</h2>
          <p className="text-[#888] text-sm mb-6">הבינה המלאכותית תבנה לך תפריט ותוכנית אימונים מותאמת אישית</p>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'weight', label: t('weight'), placeholder: '75' },
                { key: 'height', label: t('height'), placeholder: '178' },
                { key: 'age', label: t('age'), placeholder: '24' },
                { key: 'armMeasurement', label: t('armMeasurement'), placeholder: '35' },
                { key: 'legMeasurement', label: t('legMeasurement'), placeholder: '55' },
                { key: 'waistMeasurement', label: t('waistMeasurement'), placeholder: '82' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-sm text-[#888] mb-1 block">{label}</label>
                  <input type="number" placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-field" required />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#888] mb-1 block">{t('workoutsPerWeek')}</label>
                <select value={form.workoutsPerWeek} onChange={(e) => setForm({ ...form, workoutsPerWeek: Number(e.target.value) })}
                  className="input-field">
                  {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1 block">{t('goal')}</label>
                <div className="grid grid-cols-2 gap-2 h-[46px]">
                  {['bulk', 'cut'].map((g) => (
                    <button key={g} type="button" onClick={() => setForm({ ...form, goal: g })}
                      className={`rounded-xl font-semibold text-sm transition-all ${form.goal === g ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF4500] text-white' : 'bg-black border border-[#1E1E1E] text-[#888] hover:border-[#FF6B35]'}`}>
                      {g === 'bulk' ? t('bulk') : t('cut')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" disabled={generating} className="btn-primary w-full text-center relative">
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('generating')}
                </span>
              ) : t('generatePlan')}
            </button>
          </form>
        </div>
      )}

      {/* Plan Ready Cards */}
      {user?.stats && !showSetup && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={UtensilsCrossed} title={t('nutrition')} value={`${user.nutritionPlan?.dailyCalories || '—'} kcal`} color="bg-gradient-to-br from-green-500 to-emerald-600" />
            <StatCard icon={Dumbbell} title={t('workout')} value={user.workoutPlan?.planType || 'A/B Split'} color="bg-gradient-to-br from-[#FF6B35] to-[#FF4500]" />
            <StatCard icon={MessageCircle} title={t('chat')} value={`${user.stats.goal === 'bulk' ? t('bulk') : t('cut')}`} color="bg-gradient-to-br from-blue-500 to-blue-700" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/nutrition')} className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6 text-left hover:border-[#FF6B35] transition-colors group">
              <UtensilsCrossed size={24} className="text-[#FF6B35] mb-3" />
              <h3 className="text-lg font-bold mb-1">{t('nutrition')}</h3>
              <p className="text-[#888] text-sm">ראה את התפריט המותאם אישית</p>
              <ChevronRight size={16} className="text-[#FF6B35] mt-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/workout')} className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6 text-left hover:border-[#FF6B35] transition-colors group">
              <Dumbbell size={24} className="text-[#FF6B35] mb-3" />
              <h3 className="text-lg font-bold mb-1">{t('workout')}</h3>
              <p className="text-[#888] text-sm">ראה את תוכנית האימונים</p>
              <ChevronRight size={16} className="text-[#FF6B35] mt-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="text-center">
            <button onClick={() => setShowSetup(true)} className="text-[#555] hover:text-[#FF6B35] text-sm transition-colors">
              עדכן פרטים וצור תוכנית חדשה
            </button>
          </div>
        </>
      )}
    </div>
  );
}
