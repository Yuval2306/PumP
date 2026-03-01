import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Send, Bot } from 'lucide-react';

export default function ChatPage() {
  const { t } = useLang();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [remaining, setRemaining] = useState(3);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/user/chat');
      setMessages(data.messages || []);
      setRemaining(data.remaining);
    } catch {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || remaining === 0) return;

    const userMsg = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const { data } = await api.post('/user/chat', { message: input });
      const assistantMsg = { role: 'assistant', content: data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setRemaining(data.remainingMessages);
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error('הגעת לגבול היומי של 3 הודעות');
        setRemaining(0);
      } else {
        toast.error(t('error'));
      }
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-6rem)] animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('coachChat')}
          </h1>
          <p className="text-[#888] text-sm">AI-Powered Personal Coach</p>
        </div>
        <div className="bg-[#111] border border-[#1E1E1E] rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', color: remaining > 0 ? '#FF6B35' : '#555' }}>{remaining}</p>
          <p className="text-[#888] text-xs">{t('remaining')}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF4500] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-white" />
            </div>
            <p className="text-white font-bold text-lg mb-2">שלום! אני המאמן שלך 💪</p>
            <p className="text-[#888] text-sm">יש לך 3 הודעות ביום. שאל אותי כל שאלה על כושר ותזונה!</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF4500] text-white'
                : 'bg-[#111] border border-[#1E1E1E] text-white'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-50 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center mr-3 flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-3 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={remaining === 0 ? 'הגעת לגבול היומי' : t('chatPlaceholder')}
          disabled={remaining === 0 || sending}
          className="input-field flex-1"
        />
        <button type="submit" disabled={!input.trim() || remaining === 0 || sending}
          className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF4500] rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-opacity hover:opacity-90">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
