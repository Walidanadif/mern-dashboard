// backend/controllers/productController.js
const Product = require('../models/Product');
// const Category = require('../models/Category'); // Pourrait être utile si vous voulez valider la catégorie ID

// Obtenir tous les produits
exports.getProducts = async (req, res) => {
  // ... (logique de recherche, filtre, pagination si déjà ajoutée)
  try {
    const products = await Product.find({})
                                  .populate('category', 'name'); // <--- AJOUTEZ .populate() ici
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
                                 .populate('category', 'name'); // <--- AJOUTEZ .populate() ici
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  const { name, price, description, quantity, category } = req.body;
  // Optionnel : vérifier si la catégorie ID existe
  // const existingCategory = await Category.findById(category);
  // if (!existingCategory) {
  //   return res.status(400).json({ message: 'Catégorie invalide' });
  // }
  const newProduct = new Product({ name, price, description, quantity, category });

  try {
    const savedProduct = await newProduct.save();
    // Peupler la catégorie pour la réponse immédiate
    await savedProduct.populate('category', 'name'); // Peupler après la sauvegarde
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};