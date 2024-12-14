import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";

export const createReview = async (req, res, next) => {
  const { userId } = req.params;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not allowed to create review" });
  }
  try {
    let { productIds, order, rating, comment, image } = req.body;

    // If productIds is not an array, convert it to an array
    if (!Array.isArray(productIds)) {
      productIds = [productIds];
    }

    const reviews = await Promise.all(
      productIds.map(async (productId) => {
        const newReview = new Review({
          creator: userId,
          product: productId,
          order,
          rating,
          comment,
          image,
        });

        return await newReview.save();
      })
    );
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const getProductReview = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit;

    const allProductsReview = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate("creator product order");

    const totalNumber = allProductsReview.length;

    const findProductReview = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate("creator product order")
      .skip(skip)
      .limit(limit);

    if (findProductReview.length === 0) {
      return res.json({ message: "This product doesnt have any review" });
    }

    const totalRating = allProductsReview.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / totalNumber;

    res.status(200).json({
      totalNumber,
      averageRating: averageRating.toFixed(1),
      currentPage: page,
      totalPages: Math.ceil(totalNumber / limit),
      reviews: findProductReview,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductReview = async (req, res, next) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.creator._id.toString() !== req.user.id && !req.user.isAdmin) {
      console.log(review.creator._id.toString());
      console.log(req.user.id);
      console.log(req.user.isAdmin);
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this review" });
    } else {
      await Review.findByIdAndDelete(reviewId);
    }
    res
      .status(200)
      .json({ message: "Delete review of this product successfully" });
  } catch (error) {
    next(error);
  }
};

export const editReview = async (req, res, next) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.creator._id !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this review" });
    }
    const editedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          rating: req.body.rating,
          comment: req.body.comment,
          image: req.body.image,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(editedReview);
  } catch (error) {
    next(error);
  }
};

export const getUserReview = async (req, res, next) => {
  const { userId } = req.params;
  if (!req.user.isAdmin && req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not allowed to view this" });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    const allReviewOfUser = await Review.find({ creator: userId });

    const findUserReview = await Review.find({ creator: userId })
      .populate("product order")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    if (findUserReview.length === 0) {
      return res.json({ message: "This user dont have any review yet" });
    }

    const totalReview = allReviewOfUser.length;
    const totalPages = Math.ceil(totalReview / limit);

    res.status(200).json({
      totalReview,
      currentPage: page,
      totalPages,
      findUserReview,
    });
  } catch (error) {
    next(error);
  }
};

export const replyReview = async (req, res, next) => {
  const { reviewId } = req.params;

  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to reply this review" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Reply text is required" });
  }

  try {
    const findReview = await Review.findById(reviewId);

    if (!findReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    findReview.reply.push({
      adminId: req.user.id,
      text,
    });
    await findReview.save();

    res.status(200).json(findReview);
  } catch (error) {
    next(error);
  }
};

export const sortReviewStar = async (req, res, next) => {
  const { productId } = req.params;
  const { star } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit;

    const starRating = parseInt(star);
    if (!starRating || starRating < 1 || starRating > 5) {
      return res.status(400).json({ message: "Invalid star rating." });
    }

    const filteredReviews = await Review.find({
      product: productId,
      rating: starRating,
    })
      .sort({ createdAt: -1 })
      .populate("creator product order");

    const totalNumber = filteredReviews.length;

    const paginatedReviews = await Review.find({
      product: productId,
      rating: starRating,
    })
      .sort({ createdAt: -1 })
      .populate("creator product order")
      .skip(skip)
      .limit(limit);

    if (paginatedReviews.length === 0) {
      return res.json({ message: "No reviews found for this star rating." });
    }

    res.status(200).json({
      totalNumber,
      currentPage: page,
      totalPages: Math.ceil(totalNumber / limit),
      reviews: paginatedReviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewStatistic = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const allProductReviews = await Review.find({ product: productId });

    const reviewStats = {
      total: allProductReviews.length,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    allProductReviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        reviewStats[review.rating]++;
      }
    });

    res.status(200).json(reviewStats);
  } catch (error) {
    next(error);
  }
};
