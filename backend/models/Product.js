// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: { // <--- MODIFICATION ICI
    type: mongoose.Schema.Types.ObjectId, // C'est maintenant une référence à un ID d'objet
    ref: 'Category', // Fait référence au modèle 'Category'
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);