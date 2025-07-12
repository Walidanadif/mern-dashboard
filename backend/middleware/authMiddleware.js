// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de protection des routes (vérifie le token JWT)
exports.protect = async (req, res, next) => {
  let token;

  // Vérifie si l'en-tête d'autorisation existe et commence par 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrait le token de l'en-tête (après 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Vérifie et décode le token en utilisant le secret JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trouve l'utilisateur associé à l'ID décodé et l'attache à l'objet req (sans le mot de passe)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Passe au middleware ou à la route suivante
    } catch (error) {
      console.error('Erreur de vérification du token :', error);
      res.status(401).json({ message: 'Non autorisé, token invalide ou expiré' });
    }
  }

  // Si aucun token n'est fourni
  if (!token) {
    res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
  }
};

// Middleware d'autorisation basé sur les rôles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Vérifie si le rôle de l'utilisateur (attaché par le middleware 'protect') est inclus dans les rôles autorisés
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Accès refusé. Le rôle ${req.user.role} n'est pas autorisé pour cette action.` });
    }
    next(); // Passe au middleware ou à la route suivante
  };
};