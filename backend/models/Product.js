const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHe: { type: String },
  description: { type: String },
  descriptionHe: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['protein', 'clothing', 'snacks', 'supplements'], required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 100 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
