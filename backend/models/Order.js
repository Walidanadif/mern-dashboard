// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { // Référence à l'utilisateur qui a passé la commande
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Fait référence au modèle 'User'
    required: true,
  },
  products: [ // Tableau de produits dans la commande
    {
      product: { // Référence au produit
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Fait référence au modèle 'Product'
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      priceAtOrder: { // Prix du produit au moment de la commande (important pour l'historique)
        type: Number,
        required: true,
      }
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash_on_delivery', 'bank_transfer'],
    required: true,
  },
  paidAt: { // Date de paiement
    type: Date,
  },
  deliveredAt: { // Date de livraison
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);