import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      throw new ErrorHandler("No order items", 400);
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemDb) => itemDb._id.toString() === itemClient._id
      );

      if (!matchingItemFromDB) {
        throw new ErrorHandler(`Product not found: ${itemClient._id}`, 404);
      }

      return {
        ...itemClient,
        product: itemClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

export { createOrder };
