import { NavLink, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import useAuthStore from '../store/authStore';
import { Dumbbell, UtensilsCrossed, MessageCircle, ShoppingBag, User, ImageIcon, Shield, LogOut, LayoutDashboard, Globe } from 'lucide-react';

export default function Sidebar() {
  const { t, toggleLang, lang } = useLang();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/nutrition', icon: UtensilsCrossed, label: t('nutrition') },
    { to: '/workout', icon: Dumbbell, label: t('workout') },
    { to: '/chat', icon: MessageCircle, label: t('chat') },
    { to: '/store', icon: ShoppingBag, label: t('store') },
    { to: '/avatar', icon: User, label: t('avatar') },
    { to: '/progress', icon: ImageIcon, label: t('progress') },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', icon: Shield, label: t('admin') });
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#0D0D0D] border-r border-[#1E1E1E] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#1E1E1E]">
        <img src="/PumP_logo.png" alt="PumP" className="h-14 object-contain" />

      </div>

      {/* User info */}
      <div className="p-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-[#FF6B35]" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-[#555] text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF4500] text-white'
                : 'text-[#888] hover:text-white hover:bg-[#1A1A1A]'
            }`
          }>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-[#1E1E1E] space-y-2">
        <button onClick={toggleLang} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#888] hover:text-white hover:bg-[#1A1A1A] w-full text-sm font-medium transition-all">
          <Globe size={18} />
          <span>{lang === 'he' ? 'English' : 'עברית'}</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#888] hover:text-red-400 hover:bg-red-900/10 w-full text-sm font-medium transition-all">
          <LogOut size={18} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
