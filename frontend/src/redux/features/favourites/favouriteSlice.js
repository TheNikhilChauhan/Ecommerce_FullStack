import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
  name: "favourites",
  initialState: [],
  reducers: {
    addToFavourites: (state, action) => {
      //check if the product is already in favourites
      if (!state.some((product) => product._id !== action.payload._id)) {
        state.push(action.payload);
      }
    },

    removeFromFavourites: (state, action) => {
      // product with matching ID is removed
      return state.filter((product) => product._id !== action.payload._id);
    },

    setFavourites: (state, action) => {
      // set the favourites to localstorage
      return action.payload;
    },
  },
});

export const { addToFavourites, removeFromFavourites, setFavourites } =
  favouriteSlice.actions;
export const selectFavouriteProduct = (state) => state.favourites;
export default favouriteSlice.reducer;
