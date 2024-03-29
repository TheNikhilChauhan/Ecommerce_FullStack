import { useGetFilteredProductsQuery } from "../redux/api/productSlice";
import { useFetchCategoryQuery } from "../redux/api/categorySlice";
import Loader from "../components/Loader";
import {
  setCategories,
  setChecked,
  setProducts,
} from "../redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, radio, checked } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoryQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });
  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        //filter on category and price
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row ml-[4rem]">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 px-2 bg-black rounded-full mb-2 text-white">
              Filter by Categories
            </h2>

            <div>
              {categories?.map((c) => (
                <div key={c._id}>
                  <div>
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                    />

                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <>
                  <div className="flex items-enter mr-4 mb-5 text-white ">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 mr-2 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 "
                      onChange={() => handleBrandClick(brand)}
                    />

                    <label>{brand}</label>
                  </div>
                </>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white">
              Filter by Price
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
            </div>

            <div className="p-5 pt-0 text-white">
              <button
                className="w-full border my-4"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
