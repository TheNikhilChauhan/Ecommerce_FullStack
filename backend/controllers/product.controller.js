import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

/* Add Product */
const addProduct = asyncHandler(async (req, res, next) => {
  try {
    const { name, description, brand, quantity, category, price } = req.fields;
    console.log(name);
    console.log(category);
    console.log(quantity);
    console.log(description);
    console.log(price);
    console.log(brand);

    switch (true) {
      case !name:
        return next(new ErrorHandler("Name is required", 400));

      case !brand:
        return next(new ErrorHandler("Brand is required", 400));

      case !description:
        return next(new ErrorHandler("Description is required", 400));

      case !quantity:
        return next(new ErrorHandler("Qunatity is required", 400));

      case !category:
        return next(new ErrorHandler("Category is required", 400));

      case !price:
        return next(new ErrorHandler("Price is required", 400));
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

/* Update Product */
const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const { name, description, brand, quantity, category, price } = req.fields;

    switch (true) {
      case !name:
        return next(new ErrorHandler("Name is required", 400));

      case !brand:
        return next(new ErrorHandler("Brand is required", 400));

      case !description:
        return next(new ErrorHandler("Description is required", 400));

      case !quantity:
        return next(new ErrorHandler("Qunatity is required", 400));

      case !category:
        return next(new ErrorHandler("Category is required", 400));

      case !price:
        return next(new ErrorHandler("Price is required", 400));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    await product.save();

    res.json(product);
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
});

/* Remove Product */
const removeProduct = asyncHandler(async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
});

/* Fetch Products */
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    //counting the products matching the keyword
    const count = await Product.countDocuments({ ...keyword });

    //retrieving products based on keywords and page size
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
});
export { addProduct, updateProduct, removeProduct, fetchProducts };
