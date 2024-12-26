import { config } from "../configs/zaloPayConfig.js";
import moment from "moment";
import CryptoJS from "crypto-js";
import Order from "../models/orderModel.js";
import axios from "axios";

export const createPaymentZaloPay = async (req, res, next) => {
  try {
    const {
      userId,
      receiverName,
      receiverPhone,
      receiverNote,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const newOrder = await Order.create({
      userId,
      receiverName,
      receiverPhone,
      receiverNote,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentCheck: false,
    });

    const embed_data = {
      redirecturl: `${process.env.ECOMMERCE_STORE_URL}/paymentSuccess/${newOrder._id}`,
    };

    const items = products.map((product) => ({
      itemid: product.productId,
      itemname: product.name,
      itemquantity: product.quantity,
      itemprice: product.price,
      itemcolor: product.color,
      itemsize: product.size,
    }));
    const transID = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: userId,
      app_time: timestamp,
      embed_data: JSON.stringify(embed_data),
      item: JSON.stringify(items),
      amount: totalAmount,
      description: "Payment for Kaydi Ecommerce",
      bank_code: "",
      order_id: newOrder._id.toString(),
      // callback_url:''
    };

    console.log("Generated order object:", order);

    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;

    order.mac = CryptoJS.HmacSHA256(data, config.key1 || "").toString();

    const zaloPayResponse = await axios.post(config.endpoint, null, {
      params: order,
    });

    const { data: responseData } = zaloPayResponse;
    console.log("Response from ZaloPay API:", responseData);

    if (responseData.return_code === 1) {
      res.status(200).json({
        message: "Payment initiated successfully",
        data: {
          payment_url: responseData.order_url,
          zp_trans_token: responseData.zp_trans_token,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: responseData.return_message || "Payment failed",
      });
    }
  } catch (error) {
    console.error("Error in createPaymentZaloPay:", error);
    next(error);
  }
};

// export const removeItemsFromCartAfterPaySuccess = async (
//   userId,
//   productsRemove
// ) => {
//   try {
//     const userCart = await Cart.findOne({ userId });
//     if (!userCart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     productsRemove.forEach(({ productId, color, size }) => {
//       const productIndex = userCart.products.findIndex(
//         (item) =>
//           item.productId.toString() === productId &&
//           item.color === color &&
//           item.size === size
//       );

//       if (productIndex !== -1) {
//         userCart.products.splice(productIndex, 1);
//       }
//     });

//     userCart.subtotal = userCart.products.reduce(
//       (total, item) => total + item.quantity * item.price,
//       0
//     );

//     const totalProducts = userCart.products.reduce(
//       (total, item) => total + item.quantity,
//       0
//     );

//     await userCart.save();
//     return {
//       totalProducts,
//       cart: userCart,
//     };
//   } catch (error) {
//     next(error);
//   }
// };

export const paymentZaloPaySuccess = async (req, res, next) => {
  try {
    const { data: dataStr, mac: reqMac } = req.body;
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2 || "").toString();

    if (reqMac !== mac) {
      return res.json({
        return_code: -1,
        return_message: "MAC validation failed",
      });
    }

    const dataJson = JSON.parse(dataStr);
    const { order_id, user_id, return_code, products } = dataJson;

    console.log("Parsed data:", dataJson);

    if (return_code === 1) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: order_id },
        { paymentCheck: true },
        { new: true }
      );

      if (!updatedOrder) {
        return res.json({
          return_code: 0,
          return_message: "Order not found",
        });
      }

      // try {
      //   const { totalProducts, cart } = await removeItemsFromCartAfterPaySuccess(
      //     user_id,
      //     products
      //   );
      // } catch (cartError) {
      //   console.error("Error removing items from cart:", cartError);
      // }

      // Respond to ZaloPay
      return res.json({
        return_code: 1,
        return_message: "Success",
      });
    } else {
      console.log("Payment failed with return_code:", return_code);
      return res.json({
        return_code: 1,
        return_message: "Payment failed, but callback acknowledged",
      });
    }
  } catch (error) {
    console.log("Error in paymentZaloPaySuccess:", error);
    next(error);
  }
};
