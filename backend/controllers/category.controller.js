import Category from "../models/category.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name.trim()) {
      throw new ErrorHandler("Name is required", 400);
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new ErrorHandler("Name already exists", 400);
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    return res.status(400).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById({ _id: categoryId });

    if (!category) {
      throw new ErrorHandler("Category not found", 400);
    }

    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    throw new ErrorHandler("Internal server error", 500);
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const remove = await Category.findByIdAndDelete(req.params.categoryId);
    res.json(remove);
  } catch (error) {
    throw new ErrorHandler("Internal server error", 500);
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const listedCategory = await Category.find({});
    res.json(listedCategory);
  } catch (error) {
    throw new ErrorHandler("Can't load the categories", 400);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const singleCategory = await Category.findOne({ _id: req.params.id });
    res.json(singleCategory);
  } catch (error) {
    throw new ErrorHandler("Can't find the category", 400);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
