// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// **Fonction utilitaire pour générer un JWT**
const generateToken = (id) => {
  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
  // payload: les données que vous voulez inclure dans le token (ici, l'ID de l'utilisateur)
  // secretOrPrivateKey: une chaîne secrète utilisée pour signer le token (doit être dans .env)
  // options: expiresIn définit la durée de validité du token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Le token expirera après 1 heure
  });
};

// **Contrôleur pour l'enregistrement d'un nouvel utilisateur**
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body; // Récupère les données du corps de la requête

  try {
    // Vérifie si un utilisateur avec cet email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'L\'utilisateur avec cet email existe déjà' });
    }

    // Crée un nouvel utilisateur dans la base de données
    const user = await User.create({ username, email, password, role });

    // Si l'utilisateur est créé avec succès, renvoie les informations de l'utilisateur et un token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Génère un token pour le nouvel utilisateur
    });
  } catch (error) {
    // Gère les erreurs (ex: validation, erreur de base de données)
    res.status(500).json({ message: error.message });
  }
};

// **Contrôleur pour la connexion d'un utilisateur existant**
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Récupère l'email et le mot de passe

  try {
    // Trouve l'utilisateur par son email
    const user = await User.findOne({ email });

    // Vérifie si l'utilisateur existe ET si le mot de passe correspond (en utilisant la méthode matchPassword du modèle)
    if (user && (await user.matchPassword(password))) {
      // Si les identifiants sont valides, renvoie les informations de l'utilisateur et un token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Génère un token pour l'utilisateur connecté
      });
    } else {
      // Si les identifiants sont invalides
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};