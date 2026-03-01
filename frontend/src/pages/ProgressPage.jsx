import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Upload, Download } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ProgressPage() {
  const { user, refreshUser } = useAuthStore();
  const { t } = useLang();
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (side, e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (side === 'before') { setBeforeFile(f); setBeforePreview(URL.createObjectURL(f)); }
    else { setAfterFile(f); setAfterPreview(URL.createObjectURL(f)); }
  };

  const handleUpload = async () => {
    if (!beforeFile || !afterFile) {
      toast.error('העלה גם תמונת לפני וגם תמונת אחרי');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('before', beforeFile);
      formData.append('after', afterFile);
      await api.post('/user/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser();
      toast.success('תמונות ההתקדמות הועלו! 🎉');
    } catch (err) {
      toast.error(t('error'));
    } finally {
      setUploading(false);
    }
  };

  const hasCombined = user?.combinedPhoto;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('progress')}
        </h1>
        <p className="text-[#888] mt-1">Before & After Transformation</p>
      </div>

      {/* Combined Result */}
      {hasCombined && (
        <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#1E1E1E] flex justify-between items-center">
            <h2 className="font-bold">תמונת ההתקדמות שלך</h2>
            <a href={`${API_URL}${user.combinedPhoto}`} download className="flex items-center gap-2 text-[#FF6B35] text-sm hover:opacity-80">
              <Download size={16} />
              הורד
            </a>
          </div>
          <div className="relative">
            <img src={`${API_URL}${user.combinedPhoto}`} alt="progress" className="w-full" />
            <div className="absolute bottom-0 left-0 right-0 flex">
              <div className="flex-1 bg-black/60 text-white text-center py-2 font-bold text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BEFORE</div>
              <div className="flex-1 bg-[#FF6B35]/80 text-white text-center py-2 font-bold text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>AFTER</div>
            </div>
          </div>
        </div>
      )}

      {/* Upload new */}
      <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
        <h2 className="font-bold mb-4 text-lg">{t('uploadPhotos')}</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { side: 'before', label: 'BEFORE', preview: beforePreview },
            { side: 'after', label: 'AFTER', preview: afterPreview },
          ].map(({ side, label, preview }) => (
            <label key={side} className="cursor-pointer block">
              <div className={`border-2 border-dashed rounded-2xl overflow-hidden aspect-[3/4] flex items-center justify-center transition-all ${preview ? 'border-[#FF6B35]' : 'border-[#1E1E1E] hover:border-[#FF6B35]'}`}>
                {preview ? (
                  <img src={preview} alt={label} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload size={32} className="text-[#888] mx-auto mb-2" />
                    <p className="font-bold text-xl tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif', color: side === 'after' ? '#FF6B35' : '#888' }}>{label}</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(side, e)} />
            </label>
          ))}
        </div>

        <button onClick={handleUpload} disabled={!beforeFile || !afterFile || uploading}
          className="btn-primary w-full text-center flex items-center justify-center gap-2">
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              מעלה...
            </>
          ) : (
            <>
              <Upload size={18} />
              צור תמונת השוואה
            </>
          )}
        </button>
      </div>
    </div>
  );
}
