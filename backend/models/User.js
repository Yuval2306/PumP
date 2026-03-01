const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  
  // Profile
  avatar: { type: String }, // URL to avatar image
  avatarGenerated: { type: Boolean, default: false },

  // Body stats
  stats: {
    weight: Number,
    height: Number,
    age: Number,
    armMeasurement: Number,
    legMeasurement: Number,
    waistMeasurement: Number,
    workoutsPerWeek: Number,
    goal: { type: String, enum: ['bulk', 'cut'] },
  },

  // AI generated plans
  nutritionPlan: { type: mongoose.Schema.Types.Mixed },
  workoutPlan: { type: mongoose.Schema.Types.Mixed },
  planGeneratedAt: { type: Date },

  // Chat
  chatMessages: [
    {
      role: { type: String, enum: ['user', 'assistant'] },
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  dailyChatCount: { type: Number, default: 0 },
  lastChatDate: { type: Date },

  // Progress photos
  beforePhoto: { type: String },
  afterPhoto: { type: String },
  combinedPhoto: { type: String },

  // Tip of day
  lastTipIndex: { type: Number, default: -1 },
  lastTipDate: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
