import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ShoppingCart, Plus, Minus, X, CheckCircle } from 'lucide-react';

const CATEGORIES = ['all', 'protein', 'supplements', 'snacks', 'clothing'];

export default function StorePage() {
  const { t, lang } = useLang();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/store');
      setProducts(data);
      // Seed if empty
      if (!data.length) {
        await api.post('/store/seed');
        const { data: newData } = await api.get('/store');
        setProducts(newData);
      }
    } catch {}
    setLoading(false);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(lang === 'he' ? 'נוסף לסל!' : 'Added to cart!');
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleCheckout = async () => {
    try {
      await api.post('/store/checkout', { items: cart, total });
      setOrdered(true);
      setCart([]);
      setTimeout(() => { setOrdered(false); setCartOpen(false); }, 3000);
    } catch {
      toast.error(t('error'));
    }
  };

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  const categoryLabels = { all: 'הכל', protein: 'חלבון', supplements: 'תוספים', snacks: 'חטיפים', clothing: 'ביגוד' };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', background: 'linear-gradient(135deg, #FF6B35, #FF4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('store')}
        </h1>
        <button onClick={() => setCartOpen(true)} className="relative bg-[#111] border border-[#1E1E1E] hover:border-[#FF6B35] px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
          <ShoppingCart size={18} />
          <span className="text-sm font-medium">{t('cart')}</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF4500] text-white' : 'bg-[#111] border border-[#1E1E1E] text-[#888] hover:text-white hover:border-[#FF6B35]'}`}>
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(product => (
            <div key={product._id} className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition-all group">
              <div className="relative overflow-hidden h-44">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {product.featured && (
                  <span className="absolute top-2 right-2 bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-lg">⭐ מומלץ</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 truncate">{lang === 'he' ? product.nameHe || product.name : product.name}</h3>
                <p className="text-[#888] text-xs mb-3 line-clamp-2">{lang === 'he' ? product.descriptionHe || product.description : product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#FF6B35] font-black text-lg">₪{product.price}</span>
                  <button onClick={() => addToCart(product)} className="bg-gradient-to-r from-[#FF6B35] to-[#FF4500] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1">
                    <Plus size={12} />
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={() => setCartOpen(false)} />
          <div className="w-80 bg-[#111] border-l border-[#1E1E1E] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-[#1E1E1E]">
              <h2 className="font-bold text-lg">{t('cart')}</h2>
              <button onClick={() => setCartOpen(false)}><X size={20} className="text-[#888] hover:text-white" /></button>
            </div>

            {ordered ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">{t('orderSuccess')}</h3>
                <p className="text-[#888] text-sm">ההזמנה שלך בדרך! 🚚</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-center text-[#888] py-8">הסל ריק</p>
                  ) : (
                    cart.map(item => (
                      <div key={item._id} className="flex gap-3 items-center">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.nameHe || item.name}</p>
                          <p className="text-[#FF6B35] text-sm font-bold">₪{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item._id, -1)} className="w-6 h-6 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#222]"><Minus size={12} /></button>
                          <span className="w-5 text-center text-sm">{item.qty}</span>
                          <button onClick={() => updateQty(item._id, 1)} className="w-6 h-6 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#222]"><Plus size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 border-t border-[#1E1E1E]">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold">{t('total')}</span>
                    <span className="font-black text-[#FF6B35] text-lg">₪{total.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={cart.length === 0} className="btn-primary w-full text-center">
                    {t('checkout')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
