// backend/controllers/analyticsController.js (exemple)
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getSalesByMonth = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockByCategory = async (req, res) => {
  try {
    const stock = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};