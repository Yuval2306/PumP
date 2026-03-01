import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Users, Trash2, Eye, Target, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch {}
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!confirm('למחוק משתמש זה?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('משתמש נמחק');
    } catch {
      toast.error('שגיאה');
    }
  };

  if (user?.role !== 'admin') return (
    <div className="text-center py-20">
      <p className="text-red-400 font-bold text-xl">🚫 אין הרשאת גישה</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
      <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Admin Panel
      </h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'סה"כ משתמשים', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-700' },
            { label: 'עם תוכנית', value: stats.usersWithPlans, icon: Target, color: 'from-green-500 to-emerald-600' },
            { label: 'מסה', value: stats.bulkUsers, icon: TrendingUp, color: 'from-[#FF6B35] to-[#FF4500]' },
            { label: 'חיטוב', value: stats.cutUsers, icon: TrendingUp, color: 'from-purple-500 to-purple-700' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[#888] text-xs">{label}</p>
                <p className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#1E1E1E]">
          <h2 className="font-bold text-lg">ניהול משתמשים ({users.length})</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {users.map(u => (
              <div key={u._id} className="p-4 flex items-center justify-between hover:bg-[#151515] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center text-white font-bold">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-[#888] text-sm">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {u.stats?.goal && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${u.stats.goal === 'bulk' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {u.stats.goal === 'bulk' ? 'מסה' : 'חיטוב'}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-lg ${u.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {u.isVerified ? 'מאומת' : 'לא מאומת'}
                  </span>
                  <p className="text-[#888] text-xs">{new Date(u.createdAt).toLocaleDateString('he-IL')}</p>
                  <button onClick={() => setSelectedUser(u)} className="text-[#888] hover:text-white transition-colors">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => deleteUser(u._id)} className="text-[#888] hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-12 text-[#888]">אין משתמשים עדיין</div>
            )}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-[#888] hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="text-[#888]">אימייל:</span> {selectedUser.email}</p>
              {selectedUser.stats && Object.entries(selectedUser.stats).map(([k, v]) => (
                <p key={k}><span className="text-[#888]">{k}:</span> {v}</p>
              ))}
              <p><span className="text-[#888]">יש תפריט:</span> {selectedUser.nutritionPlan ? '✅' : '❌'}</p>
              <p><span className="text-[#888]">יש אימון:</span> {selectedUser.workoutPlan ? '✅' : '❌'}</p>
              <p><span className="text-[#888]">יש אווטר:</span> {selectedUser.avatarGenerated ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
