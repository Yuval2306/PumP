import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Upload, Sparkles, Lock } from 'lucide-react';

export default function AvatarPage() {
  const { user, refreshUser } = useAuthStore();
  const { t } = useLang();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleGenerate = async () => {
    if (!file) return;
    setGenerating(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const { data } = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser();
      toast.success(t('avatarReady'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('error'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('avatar')}
        </h1>
        <p className="text-[#888] mt-1 flex items-center gap-2">
          <Lock size={14} />
          {t('oneTimeOnly')} — AI-Generated Profile Image
        </p>
      </div>

      {user?.avatarGenerated ? (
        <div className="text-center py-12 space-y-6">
          <div className="relative inline-block">
            <img src={user.avatar} alt="avatar" className="w-48 h-48 rounded-full object-cover border-4 border-[#FF6B35] mx-auto pulse-glow" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('avatarReady')}</h2>
            <p className="text-[#888] text-sm mt-2">האווטר שלך מוצג בפרופיל בסרגל הניווט</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-4">
            <p className="text-[#888] text-sm">יצירת אווטר היא חד פעמית ולא ניתן לשינוי. אם רוצה לשנות, פנה לאדמין.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upload area */}
          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${preview ? 'border-[#FF6B35]' : 'border-[#1E1E1E] hover:border-[#FF6B35]'}`}>
              {preview ? (
                <img src={preview} alt="preview" className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-[#FF6B35]" />
              ) : (
                <div>
                  <Upload size={48} className="text-[#888] mx-auto mb-4" />
                  <p className="text-white font-semibold">{t('uploadPhoto')}</p>
                  <p className="text-[#888] text-sm mt-2">JPG, PNG עד 10MB</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-4 space-y-2">
            <p className="text-white font-semibold text-sm">💡 טיפים לתוצאה הטובה ביותר:</p>
            <ul className="text-[#888] text-sm space-y-1">
              <li>• השתמש בתמונה ברורה עם תאורה טובה</li>
              <li>• פנים גלויות, רקע פשוט</li>
              <li>• הבינה המלאכותית תיצור אווטר ספורטיבי ומרשים</li>
            </ul>
          </div>

          <button onClick={handleGenerate} disabled={!file || generating}
            className="btn-primary w-full text-center flex items-center justify-center gap-2">
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                יוצר אווטר...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {t('generateAvatar')}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
