import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vouchers: [],
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    setVoucher: (state, action) => {
      state.vouchers = action.payload;
    },
    clearAllVoucher: (state) => {
      state.vouchers = [];
    },
    removeSingleVoucher: (state, action) => {
      const { _id, code } = action.payload;

      state.vouchers = state.vouchers.filter(
        (item) => !(item._id === _id && item.code === code)
      );
    },
  },
});

export const { setVoucher, clearAllVoucher, removeSingleVoucher } =
  voucherSlice.actions;

export default voucherSlice.reducer;
