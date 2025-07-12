// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController'); // Importe les fonctions du contrôleur

// Route POST pour l'enregistrement d'un utilisateur
// Quand une requête POST est faite à /api/auth/register, la fonction registerUser est appelée
router.post('/register', registerUser);

// Route POST pour la connexion d'un utilisateur
// Quand une requête POST est faite à /api/auth/login, la fonction loginUser est appelée
router.post('/login', loginUser);

module.exports = router;