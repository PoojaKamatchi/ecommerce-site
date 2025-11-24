import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import path from "path";
import fs from "fs";

/**
 * GET /      -> get all categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  // convert local upload paths to absolute urls (if desired)
  const formatted = categories.map((c) => {
    const obj = c.toObject();
    if (obj.image && obj.image.startsWith("/uploads/")) {
      obj.image = `${req.protocol}://${req.get("host")}${obj.image}`;
    }
    return obj;
  });
  res.json(formatted);
});

/**
 * POST /     -> add new category
 * Accepts multipart/form-data: name (JSON string or object), image (file) OR imageUrl
 */
export const addCategory = asyncHandler(async (req, res) => {
  let { name, imageUrl } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }
  if (typeof name === "string") {
    try { name = JSON.parse(name); } catch (e) { /* leave string if not JSON */ }
  }
  if (!name.en || !name.ta) {
    res.status(400);
    throw new Error("Both English and Tamil names are required");
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : (imageUrl || "");

  const category = new Category({
    name,
    image: imagePath,
  });

  await category.save();

  const result = category.toObject();
  if (result.image && result.image.startsWith("/uploads/")) {
    result.image = `${req.protocol}://${req.get("host")}${result.image}`;
  }

  res.status(201).json(result);
});

/**
 * PUT /:id   -> update category (name and/or image)
 * Accepts multipart/form-data: name (JSON string or object), image (file) OR imageUrl
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { name, imageUrl } = req.body;

  if (name && typeof name === "string") {
    try { name = JSON.parse(name); } catch (e) { /* ignore */ }
  }

  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (name) {
    if (name.en) category.name.en = name.en;
    if (name.ta) category.name.ta = name.ta;
  }

  // image handling
  if (req.file) {
    // delete old file if it was local
    if (category.image && category.image.startsWith("/uploads/")) {
      const oldPath = path.join(process.cwd(), category.image.replace(/^\//, ""));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    category.image = `/uploads/${req.file.filename}`;
  } else if (imageUrl) {
    category.image = imageUrl;
  }

  const updated = await category.save();
  const result = updated.toObject();
  if (result.image && result.image.startsWith("/uploads/")) {
    result.image = `${req.protocol}://${req.get("host")}${result.image}`;
  }
  res.json(result);
});

/**
 * DELETE /:id -> delete category and remove uploaded image if stored locally
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // delete image file if local
  if (category.image && category.image.startsWith("/uploads/")) {
    const imgPath = path.join(process.cwd(), category.image.replace(/^\//, ""));
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  await Category.findByIdAndDelete(id);
  res.json({ message: "Category deleted successfully" });
});
