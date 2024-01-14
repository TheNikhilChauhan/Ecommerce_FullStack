import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUploadProductImageMutation,
  useCreateProductMutation,
} from "../../redux/api/productSlice";
import { useFetchCategoryQuery } from "../../redux/api/categorySlice";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQunatity] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoryQuery();
  const [createProduct] = useCreateProductMutation();

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3 text-white">
          <div className="h-12 text-white">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Image"}

              <input
                type="file"
                name="image"
                accept="image/*"
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border bg-[#101011] rounded-lg text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two ml-10">
                <label htmlFor="price">Price</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border bg-[#101011] rounded-lg text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="one">
                <label htmlFor="brand">Brand</label>
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border bg-[#101011] rounded-lg text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="two ml-10">
                <label htmlFor="name">Quantity</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border bg-[#101011] rounded-lg text-white"
                  value={quantity}
                  onChange={(e) => setQunatity(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">
              Description
            </label>

            <textarea
              type="text"
              className="p-4 mb-3 w-[95%] border bg-[#101011] rounded-lg text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between">
              <div>
                <label htmlFor="stock">Count In Stock</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border bg-[#101011] rounded-lg text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="">Category</label>
                <br />
                <select
                  placeholder="Choose Category"
                  className="p-4 mb-3 w-[30rem] border bg-[#101011] rounded-lg text-white"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
