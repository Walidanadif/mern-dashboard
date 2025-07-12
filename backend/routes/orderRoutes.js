// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Créer une commande (Tout utilisateur authentifié)
router.post('/', protect, orderController.createOrder);

// Obtenir toutes les commandes (Admin peut tout voir, User voit les siennes)
router.get('/', protect, orderController.getOrders);

// Obtenir une commande par ID (Admin peut voir n'importe quelle commande, User voit les siennes)
router.get('/:id', protect, orderController.getOrderById);

// Mettre à jour le statut d'une commande (Admin seulement)
router.put('/:id/status', protect, authorizeRoles('admin'), orderController.updateOrderStatus);

// Supprimer une commande (Admin seulement)
router.delete('/:id', protect, authorizeRoles('admin'), orderController.deleteOrder);

module.exports = router;