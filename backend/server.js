// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect, authorizeRoles } = require('./middleware/authMiddleware'); // <--- AJOUTEZ CETTE LIGNE
const categoryRoutes = require('./routes/categoryRoutes'); // <--- AJOUTEZ CETTE LIGNE
const clientRoutes = require('./routes/clientRoutes'); // <--- AJOUTEZ CETTE LIGNE
const orderRoutes = require('./routes/orderRoutes'); // <--- AJOUTEZ CETTE LIGNE


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// Middlewares
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie ! ✅'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Routes d'authentification (accessibles sans authentification)
app.use('/api/auth', authRoutes);

// Ajoutez les routes des catégories
app.use('/api/categories', categoryRoutes); // <--- AJOUTEZ CETTE LIGNE

// Ajoutez les routes des clients
app.use('/api/clients', clientRoutes); // <--- AJOUTEZ CETTE LIGNE

// Ajoutez les routes des commandes
app.use('/api/orders', orderRoutes); // <--- AJOUTEZ CETTE LIGNE

// Routes des produits (maintenant protégées)
// Toutes les requêtes vers /api/products devront passer par 'protect'
// Et pour certaines actions, nécessiteront le rôle 'admin'
app.use('/api/products', protect); // <--- AJOUTEZ CETTE LIGNE pour protéger toutes les routes /api/products

// Si vous voulez une autorisation plus fine sur les routes de produits:
// Décommentez les lignes suivantes si vous voulez un contrôle plus granulaire
/*
// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Importez ici aussi

router.get('/', protect, productController.getProducts); // Tous les utilisateurs authentifiés peuvent voir les produits
router.get('/:id', protect, productController.getProductById); // Tous les utilisateurs authentifiés peuvent voir un produit spécifique
router.post('/', protect, authorizeRoles('admin'), productController.createProduct); // Seuls les admins peuvent créer
router.put('/:id', protect, authorizeRoles('admin'), productController.updateProduct); // Seuls les admins peuvent modifier
router.delete('/:id', protect, authorizeRoles('admin'), productController.deleteProduct); // Seuls les admins peuvent supprimer

module.exports = router;

// Et dans server.js, vous n'auriez que :
// app.use('/api/products', productRoutes); // Sans le middleware ici, car il est dans le fichier de routes
*/

// Pour l'exemple, nous allons protéger toutes les routes de products via server.js comme ci-dessus.
// Cela signifie que même la lecture nécessitera un token valide.
// Si vous voulez que la lecture soit publique, vous devrez affiner les routes comme dans le commentaire.

// Route de base pour tester le serveur
app.get('/', (req, res) => {
  res.send('API du tableau de bord MERN en cours d\'exécution');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});