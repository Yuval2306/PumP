import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LangProvider } from './context/LangContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NutritionPage from './pages/NutritionPage';
import WorkoutPage from './pages/WorkoutPage';
import ChatPage from './pages/ChatPage';
import StorePage from './pages/StorePage';
import AvatarPage from './pages/AvatarPage';
import ProgressPage from './pages/ProgressPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{
          style: { background: '#111', color: '#fff', border: '1px solid #1E1E1E' },
          success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } }
        }} />
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><Layout><NutritionPage /></Layout></ProtectedRoute>} />
          <Route path="/workout" element={<ProtectedRoute><Layout><WorkoutPage /></Layout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Layout><ChatPage /></Layout></ProtectedRoute>} />
          <Route path="/store" element={<ProtectedRoute><Layout><StorePage /></Layout></ProtectedRoute>} />
          <Route path="/avatar" element={<ProtectedRoute><Layout><AvatarPage /></Layout></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Layout><ProgressPage /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Layout><AdminPage /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}
