import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // array to hold cart items
  cartCount: 0, // total number of items in the cart
  totalPrice: 0, // total price of all items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity, price, color, size } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          item.color === color &&
          item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, quantity, price, color, size });
      }

      state.cartCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
    },

    removeFromCart: (state, action) => {
      const { productId, color, size } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.color === color &&
            item.size === size
          )
      );

      state.cartCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      state.totalPrice = state.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.cartCount = 0;
      state.totalPrice = 0;
    },

    // toggleCartItem: (state, action) => {
    //   const { productId, color, size, quantity, actionType } =
    //     action.payload;

    //   const existingItem = state.items.find(
    //     (item) =>
    //       item.productId === productId &&
    //       item.color === color &&
    //       item.size === size
    //   );

    //   if (existingItem) {
    //     if (actionType === "inc") {
    //       existingItem.quantity += quantity;
    //     } else if (actionType === "dec") {
    //       existingItem.quantity -= quantity;
    //       if (existingItem.quantity <= 0) {
    //         state.items = state.items.filter(
    //           (item) =>
    //             !(
    //               item.productId === productId &&
    //               item.color === color &&
    //               item.size === size
    //             )
    //         );
    //       }
    //     }
    //   }

    //   state.cartCount = state.items.reduce(
    //     (total, item) => total + item.quantity,
    //     0
    //   );
    //   state.totalPrice = state.items.reduce(
    //     (total, item) => total + item.quantity * item.price,
    //     0
    //   );
    // },

    setCartStart: (state) => {
      state.items = [];
      state.cartCount = 0;
      state.totalPrice = 0;
    },

    setCartSuccess: (state, action) => {
      state.items = action.payload.cart.products.map((product) => ({
        productId: product.productId,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        color: product.color,
        size: product.size,
        image: product.image,
      }));
      state.cartCount = action.payload.totalProducts;
      state.totalPrice = action.payload.cart.subtotal;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  // toggleCartItem,
  setCartStart,
  setCartSuccess,
} = cartSlice.actions;

export default cartSlice.reducer;
