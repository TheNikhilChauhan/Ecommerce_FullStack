import { useParams } from "react-router";
import Header from "../components/Header";
import Message from "../components/Message";
import { useGetProductsQuery } from "../redux/api/productSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery();
  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          {/* <div>
                <div>
                    {data.products.map((product) => (
                        <div>
                            
                        </div>
                    ))}
                </div>
            </div> */}
        </>
      )}
    </>
  );
};

export default Home;
