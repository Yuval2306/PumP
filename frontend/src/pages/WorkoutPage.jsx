import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import { Download, Youtube, ChevronDown, ChevronUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function WorkoutPage() {
  const { t, lang } = useLang();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('A');
  const [openExercise, setOpenExercise] = useState(null);
  const planRef = useRef();

  useEffect(() => { fetchPlan(); }, []);

  const fetchPlan = async () => {
    try {
      const { data } = await api.get('/user/plans');
      setPlan(data.workoutPlan);
    } catch {}
    setLoading(false);
  };

  const exportPDF = async () => {
    const element = planRef.current;
    const canvas = await html2canvas(element, { backgroundColor: '#0A0A0A', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('PumP-Workout-Plan.pdf');
  };

  const getYoutubeUrl = (search) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(search)}`;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" /></div>;
  if (!plan) return <div className="text-center py-20"><p className="text-[#888]">עדיין לא נוצרה תוכנית. חזור ללוח הבקרה.</p></div>;

  const currentWorkout = activeTab === 'A' ? plan.workoutA : plan.workoutB;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          <span style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('workout')}
          </span>
        </h1>
        <button onClick={exportPDF} className="flex items-center gap-2 bg-[#111] border border-[#1E1E1E] hover:border-[#FF6B35] text-white px-4 py-2 rounded-xl transition-all text-sm font-medium">
          <Download size={16} />
          {t('exportPDF')}
        </button>
      </div>

      {/* Schedule info */}
      <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-4">
        <p className="text-[#888] text-sm">{lang === 'he' ? plan.scheduleHe || plan.schedule : plan.schedule}</p>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-2 bg-[#111] border border-[#1E1E1E] rounded-2xl p-2">
        {['A', 'B'].map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setOpenExercise(null); }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === tab ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF4500] text-white' : 'text-[#888] hover:text-white'}`}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '2px' }}>
              {t(`workout${tab}`)} — {lang === 'he' ? (tab === 'A' ? plan.workoutA?.focusHe || plan.workoutA?.focus : plan.workoutB?.focusHe || plan.workoutB?.focus) : (tab === 'A' ? plan.workoutA?.focus : plan.workoutB?.focus)}
            </span>
          </button>
        ))}
      </div>

      <div ref={planRef} className="bg-[#0A0A0A] p-2">
        {/* Warmup */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-4 mb-4">
          <p className="text-[#FF6B35] text-sm font-semibold mb-1">🔥 חימום</p>
          <p className="text-[#888] text-sm">{lang === 'he' ? currentWorkout?.warmupHe || currentWorkout?.warmup : currentWorkout?.warmup}</p>
        </div>

        {/* Exercises */}
        <div className="space-y-3">
          {(currentWorkout?.exercises || []).map((ex, i) => (
            <div key={i} className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
              <button onClick={() => setOpenExercise(openExercise === i ? null : i)}
                className="w-full flex justify-between items-center p-4 hover:bg-[#1A1A1A] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF4500] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="text-left">
                    <p className="text-white font-semibold">{lang === 'he' ? ex.nameHe || ex.name : ex.name}</p>
                    <p className="text-[#888] text-sm">{ex.sets} {t('sets')} × {ex.reps} {t('reps')} | {t('rest')}: {lang === 'he' ? ex.restHe || ex.rest : ex.rest}</p>
                  </div>
                </div>
                {openExercise === i ? <ChevronUp size={18} className="text-[#888]" /> : <ChevronDown size={18} className="text-[#888]" />}
              </button>

              {openExercise === i && (
                <div className="px-4 pb-4 border-t border-[#1A1A1A] pt-4">
                  <p className="text-[#888] text-sm mb-4">
                    💡 {lang === 'he' ? ex.tipsHe || ex.tips : ex.tips}
                  </p>
                  <a href={getYoutubeUrl(ex.youtubeSearch || ex.name)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    <Youtube size={16} />
                    {t('watchVideo')}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cooldown */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-4 mt-4">
          <p className="text-blue-400 text-sm font-semibold mb-1">❄️ שחרור</p>
          <p className="text-[#888] text-sm">{currentWorkout?.cooldown}</p>
        </div>

        {/* General Tips */}
        {plan.generalTips && (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6 mt-4">
            <h3 className="font-bold mb-3">💪 טיפים כלליים</h3>
            <ul className="space-y-2">
              {(lang === 'he' ? plan.generalTipsHe || plan.generalTips : plan.generalTips).map((tip, i) => (
                <li key={i} className="flex gap-2 text-[#888] text-sm">
                  <span className="text-[#FF6B35]">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
