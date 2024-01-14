import { useNavigate, useParams } from "react-router";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productSlice";
import { useEffect, useState } from "react";
import { useFetchCategoryQuery } from "../../redux/api/categorySlice";

const ProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [category, setCategory] = useState(productData?.category || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [stock, setStock] = useState(productData?.countInStock);

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoryQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  const [updateProduct] = useUpdateProductMutation();

  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setPrice(productData.price);
      setDescription(productData.description);
      setCategory(productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  return (
    <>
      <div>
        <div>
          <div>
            <div>Update / Delete Product</div>

            {image && (
                <div className="text-center">
                    <img
                    src={image}
                    alt="product"
                    className="block mx-auto w-full h-[40%]"
                </div>
            )}

            <div>
                <label className="text-white  px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                    {image? image.name : "Upload Image"}
                    <input  
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={}
                    className="text-white"
                    />
                    </label>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductUpdate;
