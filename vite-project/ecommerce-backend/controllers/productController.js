import Product from "../models/Product.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Stock (Increase/Decrease)
export const updateProductStock = async (req, res) => {
  try {
    const productId = req.params.id;
    const { stockChange } = req.body; // positive or negative number

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock += stockChange;

    if (product.stock < 0) product.stock = 0;

    await product.save();

    res.status(200).json({ message: "Stock updated", stock: product.stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // case-insensitive search
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
