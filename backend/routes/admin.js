const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET ALL USERS
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password -otp -otpExpiry').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SINGLE USER
router.get('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp -otpExpiry');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE USER
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// STATS OVERVIEW
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const usersWithPlans = await User.countDocuments({ role: 'user', nutritionPlan: { $exists: true } });
    const bulkUsers = await User.countDocuments({ 'stats.goal': 'bulk' });
    const cutUsers = await User.countDocuments({ 'stats.goal': 'cut' });
    res.json({ totalUsers, usersWithPlans, bulkUsers, cutUsers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
