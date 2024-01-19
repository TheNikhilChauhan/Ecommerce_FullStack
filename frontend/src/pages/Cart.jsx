import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = (product, quantity) => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container flex justify-around items-start flex-wrap mx-auto  text-white">
        {cartItems.length === 0 ? (
          <div className="mt-8">
            Your cart is empty <Link to="/shop">Go To Shop</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%] mt-8">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center mb-[1rem] pb-2"
                >
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} className="text-pink-500">
                      {item.name}
                    </Link>

                    <div>{item.brand}</div>
                    <div>&#8377;{item.price}</div>
                  </div>

                  <div className="w-24">
                    <select
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                      value={item.quantity}
                      className="w-full p-1 border rounded text-white bg-slate-950"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option value={x + 1} key={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>

                  <div className="text-2xl font-bold">
                    &#8377;{" "}
                    {cartItems
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </div>

                  <button
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                    className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
