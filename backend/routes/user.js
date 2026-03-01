const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { generateNutritionPlan, generateWorkoutPlan, chatWithCoach, generateAvatar } = require('../services/openaiService');
const TIPS = require('../data/tips');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// GET TIP OF DAY
router.get('/tip', protect, async (req, res) => {
  try {
    const user = req.user;
    const today = new Date().toDateString();
    const lastTipDate = user.lastTipDate ? new Date(user.lastTipDate).toDateString() : null;

    let tipIndex;
    if (lastTipDate === today && user.lastTipIndex >= 0) {
      tipIndex = user.lastTipIndex;
    } else {
      tipIndex = (user.lastTipIndex + 1) % TIPS.length;
      await User.findByIdAndUpdate(user._id, { lastTipIndex: tipIndex, lastTipDate: new Date() });
    }

    res.json({ tip: TIPS[tipIndex], index: tipIndex });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// SAVE STATS & GENERATE PLANS
router.post('/stats', protect, async (req, res) => {
  try {
    const { weight, height, age, armMeasurement, legMeasurement, waistMeasurement, workoutsPerWeek, goal } = req.body;
    
    const stats = { weight, height, age, armMeasurement, legMeasurement, waistMeasurement, workoutsPerWeek, goal };
    
    // Generate both plans
    const [nutritionPlan, workoutPlan] = await Promise.all([
      generateNutritionPlan(stats),
      generateWorkoutPlan(stats)
    ]);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { stats, nutritionPlan, workoutPlan, planGeneratedAt: new Date() },
      { new: true }
    ).select('-password -otp -otpExpiry');

    res.json({ user: updatedUser, nutritionPlan, workoutPlan });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Error generating plans', error: err.message });
  }
});

// GET USER PLANS
router.get('/plans', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats nutritionPlan workoutPlan planGeneratedAt');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CHAT WITH COACH
router.post('/chat', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date().toDateString();
    const lastChatDate = user.lastChatDate ? new Date(user.lastChatDate).toDateString() : null;

    if (lastChatDate === today && user.dailyChatCount >= 3) {
      return res.status(429).json({ message: 'Daily limit reached. You have 3 messages per day.' });
    }

    const { message } = req.body;
    const userMessages = [...(user.chatMessages || []).map(m => ({ role: m.role, content: m.content })), { role: 'user', content: message }];
    
    const reply = await chatWithCoach(userMessages, user.stats || {});

    const newUserMsg = { role: 'user', content: message, timestamp: new Date() };
    const newAssistantMsg = { role: 'assistant', content: reply, timestamp: new Date() };

    const dailyCount = lastChatDate === today ? user.dailyChatCount + 1 : 1;

    await User.findByIdAndUpdate(user._id, {
      $push: { chatMessages: { $each: [newUserMsg, newAssistantMsg] } },
      dailyChatCount: dailyCount,
      lastChatDate: new Date()
    });

    res.json({ reply, remainingMessages: 3 - dailyCount });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
});

// GET CHAT HISTORY
router.get('/chat', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('chatMessages dailyChatCount lastChatDate');
    const today = new Date().toDateString();
    const lastChatDate = user.lastChatDate ? new Date(user.lastChatDate).toDateString() : null;
    const remaining = lastChatDate === today ? Math.max(0, 3 - user.dailyChatCount) : 3;
    res.json({ messages: user.chatMessages || [], remaining });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPLOAD BEFORE/AFTER PHOTOS
router.post('/photos', protect, upload.fields([{ name: 'before', maxCount: 1 }, { name: 'after', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files.before || !req.files.after)
      return res.status(400).json({ message: 'Both before and after photos required' });

    // Process images
    const beforeBuf = await sharp(req.files.before[0].buffer).resize(600, 800, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer();
    const afterBuf = await sharp(req.files.after[0].buffer).resize(600, 800, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer();

    // Create combined side-by-side image
    const combined = await sharp({
      create: { width: 1200, height: 800, channels: 3, background: { r: 10, g: 10, b: 10 } }
    })
    .composite([
      { input: beforeBuf, left: 0, top: 0 },
      { input: afterBuf, left: 600, top: 0 }
    ])
    .jpeg({ quality: 90 })
    .toBuffer();

    // Save files
    const userId = req.user._id.toString();
    const beforePath = `/uploads/${userId}_before.jpg`;
    const afterPath = `/uploads/${userId}_after.jpg`;
    const combinedPath = `/uploads/${userId}_combined.jpg`;

    fs.writeFileSync(path.join(__dirname, '..', beforePath), beforeBuf);
    fs.writeFileSync(path.join(__dirname, '..', afterPath), afterBuf);
    fs.writeFileSync(path.join(__dirname, '..', combinedPath), combined);

    await User.findByIdAndUpdate(req.user._id, { beforePhoto: beforePath, afterPhoto: afterPath, combinedPhoto: combinedPath });

    res.json({ before: beforePath, after: afterPath, combined: combinedPath });
  } catch (err) {
    res.status(500).json({ message: 'Error processing photos', error: err.message });
  }
});

// GENERATE AVATAR
router.post('/avatar', protect, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.avatarGenerated) return res.status(400).json({ message: 'Avatar already generated. One-time only.' });

    if (!req.file) return res.status(400).json({ message: 'Photo required' });

    const avatarUrl = await generateAvatar(req.file.buffer.toString('base64'));

    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl, avatarGenerated: true });

    res.json({ avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Error generating avatar', error: err.message });
  }
});

module.exports = router;
