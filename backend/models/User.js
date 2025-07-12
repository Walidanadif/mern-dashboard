// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importez bcryptjs

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true // Supprime les espaces blancs au début et à la fin
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // Convertit l'email en minuscules
  },
  password: {
    type: String,
    required: true
  },
  role: { // Champ pour gérer les rôles (ex: 'admin', 'user')
    type: String,
    enum: ['admin', 'user'], // Définit les valeurs autorisées pour le rôle
    default: 'user' // Rôle par défaut si non spécifié
  }
}, {
  timestamps: true // Ajoute automatiquement les champs `createdAt` et `updatedAt`
});

// **Middleware Mongoose pour hacher le mot de passe avant de sauvegarder**
// 'pre' signifie que cette fonction s'exécutera avant l'événement 'save'
userSchema.pre('save', async function (next) {
  // Ne hache le mot de passe que s'il a été modifié (ou si c'est un nouvel utilisateur)
  if (!this.isModified('password')) {
    return next();
  }
  // Génère un "sel" (salt) pour le hachage, plus le nombre est élevé, plus le hachage est sûr mais lent
  const salt = await bcrypt.genSalt(10);
  // Hache le mot de passe de l'utilisateur avec le sel généré
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Passe au prochain middleware ou à l'opération de sauvegarde
});

// **Méthode pour comparer les mots de passe**
// Cette méthode sera disponible sur les instances de User (user.matchPassword(password))
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare le mot de passe fourni avec le mot de passe haché stocké
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);