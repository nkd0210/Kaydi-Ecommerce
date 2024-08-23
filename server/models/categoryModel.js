import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }, // name la viet bang tieng anh
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
    heroImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
