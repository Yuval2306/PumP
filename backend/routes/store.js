const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE PRODUCT (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// SEED PRODUCTS
router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      { name: 'Whey Protein Gold', nameHe: 'וואי חלבון גולד', description: 'Premium whey protein, 24g protein per serving, chocolate flavor', descriptionHe: 'חלבון מי גבינה פרימיום, 24 גרם חלבון למנה, טעם שוקולד', price: 149, category: 'protein', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', featured: true },
      { name: 'Casein Protein', nameHe: 'קזאין חלבון', description: 'Slow-release protein for overnight recovery, vanilla flavor', descriptionHe: 'חלבון שחרור איטי להתאוששות לילית, טעם וניל', price: 169, category: 'protein', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
      { name: 'Creatine Monohydrate', nameHe: 'קריאטין מונוהידראט', description: 'Pure micronized creatine, 300g, unflavored', descriptionHe: 'קריאטין מיקרונייז טהור, 300 גרם, ללא טעם', price: 89, category: 'supplements', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', featured: true },
      { name: 'BCAA Energy', nameHe: 'BCAA אנרגיה', description: 'Branch chain amino acids with caffeine for intra-workout fuel', descriptionHe: 'חומצות אמינו מסועפות עם קפאין לאנרגיה במהלך האימון', price: 109, category: 'supplements', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
      { name: 'Pre-Workout Surge', nameHe: 'פרה-וורקאוט סאר\'', description: 'High stimulant pre-workout with beta-alanine and citrulline', descriptionHe: 'פרה-וורקאוט עוצמתי עם בטא-אלנין וציטרולין', price: 129, category: 'supplements', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80' },
      { name: 'Protein Bar Box', nameHe: 'קופסת חטיפי חלבון', description: '12 bars, 20g protein each, assorted flavors', descriptionHe: '12 חטיפים, 20 גרם חלבון לחטיף, טעמים מגוונים', price: 79, category: 'snacks', image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80', featured: true },
      { name: 'Rice Cakes Pack', nameHe: 'חבילת עוגות אורז', description: 'Low calorie, high carb snack for pre-workout energy', descriptionHe: 'חטיף קלוריות נמוכות, פחמימות גבוהות לאנרגיה לפני אימון', price: 29, category: 'snacks', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
      { name: 'PumP Performance Tee', nameHe: 'חולצת PumP פרפורמנס', description: 'Moisture-wicking training tee, available in S-XL', descriptionHe: 'חולצת אימון סופגת זיעה, זמינה בS-XL', price: 89, category: 'clothing', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80', featured: true },
      { name: 'Compression Shorts', nameHe: 'מכנסי קומפרשן', description: 'High-performance compression shorts for maximum mobility', descriptionHe: 'מכנסי קומפרשן ביצועים גבוהים למקסימום תנועתיות', price: 119, category: 'clothing', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80' },
      { name: 'Training Gloves', nameHe: 'כפפות אימון', description: 'Padded gloves for better grip and hand protection', descriptionHe: 'כפפות מרופדות לאחיזה טובה יותר והגנה על הידיים', price: 59, category: 'clothing', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' }
    ];
    await Product.insertMany(products);
    res.json({ message: 'Products seeded', count: products.length });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding', error: err.message });
  }
});

// CHECKOUT (virtual - just returns success)
router.post('/checkout', protect, async (req, res) => {
  try {
    const { items, total } = req.body;
    // In real world, process payment here
    res.json({ 
      success: true, 
      orderId: `PUMP-${Date.now()}`,
      message: 'Order placed successfully! (Virtual checkout)',
      messageHe: 'ההזמנה בוצעה בהצלחה! (תשלום וירטואלי)'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
