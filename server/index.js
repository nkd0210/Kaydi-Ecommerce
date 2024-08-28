import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cartRoute from "./routes/cartRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import voucherRoute from "./routes/voucherRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // allow json as the input of the BE
app.use(cookieParser());
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/category", categoryRoute);
app.use("/api/voucher", voucherRoute);
app.use("/api/review", reviewRoute);
