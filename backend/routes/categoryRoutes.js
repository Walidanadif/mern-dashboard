// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Importez pour la protection

// Protégeons les routes des catégories
// Seuls les admins peuvent créer, modifier, supprimer des catégories
router.post('/', protect, authorizeRoles('admin'), categoryController.createCategory);
router.put('/:id', protect, authorizeRoles('admin'), categoryController.updateCategory);
router.delete('/:id', protect, authorizeRoles('admin'), categoryController.deleteCategory);

// Tous les utilisateurs authentifiés (et les invités si vous retirez 'protect') peuvent voir les catégories
router.get('/', protect, categoryController.getCategories);
router.get('/:id', protect, categoryController.getCategoryById);

module.exports = router;