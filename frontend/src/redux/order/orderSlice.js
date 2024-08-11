import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  totalPrice: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setClearOrder: (state) => {
      state.products = [];
      state.totalPrice = 0;
    },
    setOrderSuccess: (state, action) => {
      state.products = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    },
    removeSingleItemInOrder: (state, action) => {
      const { productId, color, size } = action.payload;

      state.products = state.products.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.color === color &&
            item.size === size
          )
      );

      state.totalPrice = state.products.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
    },
  },
});

export const { setClearOrder, setOrderSuccess, removeSingleItemInOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
