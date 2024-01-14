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

/* fetch products by id */
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      throw new ErrorHandler("Product not found", 404);
    }
  } catch (error) {
    throw new ErrorHandler(error.message, 404);
  }
});

/* fetch All products */
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(product);
  } catch (error) {
    throw new ErrorHandler({ error: "Server Error" }, 404);
  }
});

/* adding review of product */
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        throw new ErrorHandler("Product already reviewed.", 400);
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      console.log(req.user);
      console.log(product.reviews);
      console.log(product.reviews.map((review) => review.user));

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      throw new ErrorHandler("Product not found", 404);
    }
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
});

/* Fetching top products */
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(product);
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
});

/* Fetch newly added products */
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(product);
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
});

/* Filter products */
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
});

export {
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
