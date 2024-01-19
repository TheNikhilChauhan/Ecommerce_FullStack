import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productSlice";
import Loader from "../../components/Loader";
import SmallProduct from "./SmallProduct";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNum) => {
    setActiveTab(tabNum);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <section className="text-white mr-[5rem]">
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab === 1 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab === 2 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab === 3 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      {/* second section: details of the active tab */}

      <section>
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                {/* rating */}
                <div className="my-2">
                  <label
                    htmlFor="rating"
                    className="block text-xl mb-2 text-white"
                  >
                    Rating
                  </label>

                  <select
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                    id="rating"
                    required
                    className="p-2 border rounded-lg xl:w-[40rem] text-white bg-gray-950"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                {/* comment */}
                <div className="my-2">
                  <label
                    htmlFor="comment"
                    className="block text-xl mb-2 text-white"
                  >
                    Comment
                  </label>

                  <textarea
                    id="comment"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg xl:w-[40rem] text-white bg-gray-950"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg"
                  disabled={loadingProductReview}
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login">Sign In</Link> to write a review
              </p>
            )}
          </div>
        )}
      </section>

      {/* section 2 active button 2 */}
      <section>
        {activeTab === 2 && (
          <>
            <div className="text-white">
              {product.reviews.length === 0 && <p>No Reviews</p>}
            </div>

            <div>
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1A1A1A] p-4 rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[50rem] sm:w-[24rem] mb-5 text-white"
                >
                  <div className="flex justify-between">
                    <strong className="text-[#B0B0B0]">{review.name}</strong>
                    <p className="text-[#B0B0B0]">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>

                  <p className="my-4">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section>
        {activeTab === 3 && (
          <section className="ml-[4rem] flex flex-wrap">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
