export const addDecimal = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //calculate items price
  state.itemsPrice = addDecimal(
    state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  //calculate the shipping price
  state.shippingPrice = addDecimal(state.itemsPrice > 100 ? 0 : 20);

  //calculate the tax
  state.taxPrice = addDecimal(Number((18 / 100) * state.itemsPrice).toFixed(2));

  //calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  //save cart items to localstorage
  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
