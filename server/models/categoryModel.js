import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }, // name la viet bang tieng
    title: {
      type: String,
      required: true,
    }, // title la de hien thi len UI nguoi dung
    description: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
