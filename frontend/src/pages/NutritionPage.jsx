import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/authStore';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import { Download, Apple } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function NutritionPage() {
  const { user } = useAuthStore();
  const { t, lang } = useLang();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const planRef = useRef();

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const { data } = await api.get('/user/plans');
      setPlan(data.nutritionPlan);
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
    pdf.save('PumP-Nutrition-Plan.pdf');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" /></div>;

  if (!plan) return (
    <div className="text-center py-20">
      <p className="text-[#888] text-lg">עדיין לא נוצר תפריט. חזור ללוח הבקרה והגדר את הפרופיל שלך.</p>
    </div>
  );

  const macroPercent = (val, total) => Math.round((val / total) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          <span style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('nutrition')}
          </span>
        </h1>
        <button onClick={exportPDF} className="flex items-center gap-2 bg-[#111] border border-[#1E1E1E] hover:border-[#FF6B35] text-white px-4 py-2 rounded-xl transition-all text-sm font-medium">
          <Download size={16} />
          {t('exportPDF')}
        </button>
      </div>

      <div ref={planRef} className="space-y-6 bg-[#0A0A0A] p-2">
        {/* Calories & Macros */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
          <div className="text-center mb-6">
            <p className="text-[#888] text-sm mb-1">{t('dailyCalories')}</p>
            <p className="text-6xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {plan.dailyCalories}
            </p>
            <p className="text-[#888] text-sm">קלוריות</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('protein'), key: 'protein', color: '#FF6B35' },
              { label: t('carbs'), key: 'carbs', color: '#3B82F6' },
              { label: t('fats'), key: 'fats', color: '#10B981' },
            ].map(({ label, key, color }) => (
              <div key={key} className="bg-black rounded-xl p-4 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-black text-lg" style={{ background: color }}>
                  {plan.macros?.[key]?.percentage || 0}%
                </div>
                <p className="text-white font-bold text-xl">{plan.macros?.[key]?.grams || 0}g</p>
                <p className="text-[#888] text-xs mt-1">{label}</p>
                <p className="text-[#555] text-xs">{plan.macros?.[key]?.calories || 0} kcal</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-4">
          {(plan.meals || []).map((meal, i) => (
            <div key={i} className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg">{lang === 'he' ? meal.nameHe || meal.name : meal.name}</h3>
                  <p className="text-[#888] text-sm">{meal.time}</p>
                </div>
                <span className="bg-[#FF6B35]/20 text-[#FF6B35] px-3 py-1 rounded-lg text-sm font-semibold">{meal.calories} kcal</span>
              </div>
              <div className="space-y-2">
                {(meal.foods || []).map((food, j) => (
                  <div key={j} className="flex justify-between items-center py-2 border-b border-[#1A1A1A] last:border-0">
                    <div>
                      <p className="text-white text-sm font-medium">{lang === 'he' ? food.nameHe || food.name : food.name}</p>
                      <p className="text-[#888] text-xs">{food.amount}</p>
                    </div>
                    <div className="text-right text-xs text-[#888] space-y-0.5">
                      <p>{food.calories} kcal</p>
                      <p>P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {plan.notes && (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Apple size={18} className="text-[#FF6B35]" /> הערות</h3>
            <p className="text-[#888] text-sm">{lang === 'he' ? plan.notesHe || plan.notes : plan.notes}</p>
            {plan.supplements && (
              <div className="mt-4">
                <p className="text-white font-semibold text-sm mb-2">תוספים מומלצים:</p>
                <div className="flex flex-wrap gap-2">
                  {(lang === 'he' ? plan.supplementsHe || plan.supplements : plan.supplements).map((s, i) => (
                    <span key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] px-3 py-1 rounded-lg text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
