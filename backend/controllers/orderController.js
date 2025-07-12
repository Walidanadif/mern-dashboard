// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product'); // Pour vérifier la quantité et le prix

// Obtenir toutes les commandes (Admin peut tout voir, User ne voit que ses commandes)
exports.getOrders = async (req, res) => {
  try {
    let query = {};
    // Si l'utilisateur n'est pas admin, il ne voit que ses propres commandes
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    // Utilisez .populate() pour récupérer les détails de l'utilisateur et des produits
    const orders = await Order.find(query)
                               .populate('user', 'username email') // Ne charge que username et email de l'utilisateur
                               .populate('products.product', 'name price'); // Ne charge que name et price des produits
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
                              .populate('user', 'username email')
                              .populate('products.product', 'name price');
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    // Vérification de propriété : un utilisateur normal ne peut voir que ses propres commandes
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé. Cette commande ne vous appartient pas.' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'Aucun article de commande' });
  }

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Produit non trouvé: ${item.product}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Quantité insuffisante pour ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price, // Important pour avoir le prix historique
      });
      totalAmount += product.price * item.quantity;

      // Décrémente la quantité en stock
      product.quantity -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id, // L'ID de l'utilisateur qui fait la requête (via protect middleware)
      products: orderItems,
      totalAmount: totalAmount,
      shippingAddress,
      paymentMethod,
      paidAt: new Date(), // Simule le paiement immédiat pour cet exemple
      status: 'processing'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour le statut d'une commande (souvent admin seulement)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Seul un admin peut changer le statut
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent mettre à jour le statut des commandes.' });
    }

    order.status = status;
    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une commande (Admin seulement)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Réincrémente la quantité des produits en stock avant suppression
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    await Order.deleteOne({ _id: req.params.id }); // Utilisez deleteOne ou findByIdAndDelete
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};