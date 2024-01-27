import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

/* calculate price */
function calculatePrice(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 20;
  const taxRate = 0.18;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (itemsPrice + shippingPrice + parseInt(taxPrice)).toFixed(
    2
  );

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}
/* create order */
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

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calculatePrice(dbOrderItems);

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

/* get all orders */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

/* get user orders */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

/* total orders  */
const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

/*  total sales */
const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

/* total sales by Date */
const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.json(salesByDate);
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

/* order by id */
const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new ErrorHandler("Order not found");
    }
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

/* marking order as paid */
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new ErrorHandler("Order not found");
    }
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

/*marked order is delivered */
const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new ErrorHandler("Order not found");
    }
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};
export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsDelivered,
  markOrderAsPaid,
};
