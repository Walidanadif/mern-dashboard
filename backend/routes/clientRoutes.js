// backend/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protégez les routes des clients (par exemple, seuls les admins peuvent créer/modifier/supprimer)
router.post('/', protect, authorizeRoles('admin'), clientController.createClient);
router.put('/:id', protect, authorizeRoles('admin'), clientController.updateClient);
router.delete('/:id', protect, authorizeRoles('admin'), clientController.deleteClient);

// Tous les utilisateurs authentifiés peuvent voir les clients
router.get('/', protect, clientController.getClients);
router.get('/:id', protect, clientController.getClientById);

module.exports = router;