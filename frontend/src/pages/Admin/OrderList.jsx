import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className="mt-[2rem] text-white text-center font-bold text-2xl mb-3">
            Order List
          </h1>
          <table className="container ml-[5rem] p-10">
            <AdminMenu />

            <thead className="w-full border text-white ">
              <tr>
                <th className="text-left pl-1">ITEMS</th>
                <th className="text-left pl-1">ID</th>
                <th className="text-left pl-1">USER</th>
                <th className="text-left pl-1">DATA</th>
                <th className="text-left pl-1">TOTAL</th>
                <th className="text-left pl-1">PAID</th>
                <th className="text-left pl-1">DELIVERED</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="text-white">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-[5rem] pt-4"
                    />
                  </td>
                  <td>{order._id}</td>

                  <td>{order.user ? order.user.name : "N/A"}</td>

                  <td>
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>

                  <td>&#8377;{order.totalPrice}</td>

                  <td className="py-2">
                    {order.isPaid ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                        Pending
                      </p>
                    )}
                  </td>

                  <td className="px-2 py-2">
                    {order.isDelivered ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                        Pending
                      </p>
                    )}
                  </td>

                  <td>
                    <Link to={`/order/${order._id}`}>
                      <button>More</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default OrderList;
