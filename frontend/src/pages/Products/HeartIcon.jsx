import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  addToFavourites,
  setFavourites,
  removeFromFavourites,
} from "../../redux/features/favourites/favouriteSlice";

import {
  addFavouriteToLocalStorage,
  getFavouritesFromLocalStorage,
  removeFavouriteFromLocalStorage,
} from "../../Utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites) || [];
  const isFavourite = favourites.some((p) => p._id === product._id);

  useEffect(() => {
    const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
    dispatch(setFavourites(favouritesFromLocalStorage));
  }, []);

  const toggleFavourites = () => {
    if (isFavourite) {
      dispatch(removeFromFavourites(product));
      //removing from localstorage
      removeFavouriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavourites(product));
      //add product to localstorage
      addFavouriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavourites}
    >
      {isFavourite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-black" />
      )}
    </div>
  );
};

export default HeartIcon;
