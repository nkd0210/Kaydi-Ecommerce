import Voucher from "../models/voucherModel.js";

export const createVoucher = async (req, res, next) => {
  const userId = req.params.userId;
  const {
    code,
    discount,
    expiryDate,
    usageLimit,
    applyProducts,
    applyCategories,
    // applyUserIds,
  } = req.body;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not admin to perform this action" });
  }
  try {
    const newVoucher = new Voucher({
      code,
      discount,
      expiryDate,
      usageLimit,
      applyProducts,
      applyCategories,
      // applyUserIds,
    });

    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    next(error);
  }
};

export const getAllVouchers = async (req, res, next) => {
  const userId = req.params.userId;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not admin to perform this action" });
  }
  try {
    const vouchers = await Voucher.find();
    if (vouchers.length === 0) {
      return res.status(404).json({ message: "No vouchers found" });
    }
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    const lastWeekVoucher = await Voucher.find({
      createdAt: { $gte: oneWeekAgo },
    });

    const lastMonthVoucher = await Voucher.find({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      totalVouchers: vouchers.length,
      lastWeekVouchersCount: lastWeekVoucher.length,
      lastWeekVouchers: lastWeekVoucher,
      lastMonthVouchersCount: lastMonthVoucher.length,
      lastMonthVouchers: lastMonthVoucher,
      vouchers: vouchers,
    });
  } catch (error) {
    next(error);
  }
};

export const getVoucherById = async (req, res, next) => {
  const { userId, voucherId } = req.params;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not admin to perform this action" });
  }
  try {
    const findVoucher = await Voucher.findById(voucherId);
    if (!findVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    res.status(200).json(findVoucher);
  } catch (error) {
    next(error);
  }
};

export const updateVoucher = async (req, res, next) => {
  const { userId, voucherId } = req.params;
  const {
    code,
    discount,
    expiryDate,
    usageLimit,
    applyProducts,
    applyCategories,
    // applyUserIds,
    status,
  } = req.body;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not admin to perform this action" });
  }
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      {
        $set: {
          code,
          discount,
          expiryDate,
          usageLimit,
          applyProducts,
          applyCategories,
          // applyUserIds,
          status,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedVoucher);
  } catch (error) {
    next(error);
  }
};

export const deleteVoucher = async (req, res, next) => {
  const { userId, voucherId } = req.params;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not admin to perform this action" });
  }
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    return res
      .status(200)
      .json({ message: "Voucher has been deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const applyVoucher = async (req, res, next) => {
  const { userId, code } = req.params;
  const { productIds, categories } = req.body;

  try {
    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ message: "Voucher usage limit reached" });
    }

    if (voucher.expiryDate < new Date()) {
      voucher.status = "expired";
      await voucher.save();
      return res.status(400).json({ message: "Voucher has expired" });
    }

    // if (voucher.applyUserIds.length && !voucher.applyUserIds.includes(userId)) {
    //   return res
    //     .status(400)
    //     .json({ message: "Voucher not apply to this user" });
    // }

    if (voucher.applyProducts.length) {
      // return an array of product ID
      const applyProductIds = voucher.applyProducts.map((product) =>
        product.toString()
      );
      const isProductApply = productIds.every((productId) =>
        applyProductIds.includes(productId)
      );
      if (!isProductApply) {
        return res
          .status(400)
          .json({ message: "Voucher not apply to these product" });
      }
    }

    if (voucher.applyCategories.length) {
      const applyCategory = voucher.applyCategories.map((category) =>
        category.toString()
      );
      const isApplyCategory = categories.every((category) =>
        applyCategory.includes(category)
      );
      if (!isApplyCategory) {
        return res
          .status(400)
          .json({ message: "Voucher not apply to these category" });
      }
    }

    voucher.usedCount += 1;
    await voucher.save();
    res.status(200).json({ message: "Voucher applied successfully" });
  } catch (error) {
    next(error);
  }
};
