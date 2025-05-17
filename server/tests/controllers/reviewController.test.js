/**
 * @jest-environment node
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

const {
  connect,
  closeDatabase,
  clearDatabase,
} = require("../setup/mongoMemoryServer.js");

const reviewController = require("../../controllers/reviewController.js");
const {
  createReview,
  createMultipleReviews,
} = require("../helpers/reviewHelper.js");

const app = express();
app.use(express.json());

const sampleUserId = new mongoose.Types.ObjectId().toString();
const sampleProductId = new mongoose.Types.ObjectId().toString();

// Middleware to simulate authenticated user
app.use((req, res, next) => {
  req.user = {
    id: sampleUserId,
    isAdmin: true,
  };
  next();
});

// Routes
app.post("/reviews/:userId", reviewController.createReview);
app.get("/reviews/product/:productId", reviewController.getProductReview);
app.delete("/reviews/:reviewId", reviewController.deleteProductReview);
app.put("/reviews/:reviewId", reviewController.editReview);
app.get("/reviews/user/:userId", reviewController.getUserReview);
app.post("/reviews/reply/:reviewId", reviewController.replyReview);
app.get("/reviews/star/:productId", reviewController.sortReviewStar);
app.get("/reviews/statistic/:productId", reviewController.getReviewStatistic);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("ReviewController Integration", () => {
  test("#TC001 - should create a review", async () => {
    const res = await request(app)
      .post(`/reviews/${sampleUserId}`)
      .send({
        productIds: [sampleProductId],
        order: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Excellent",
        image: "img1.jpg",
      });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].comment).toBe("Excellent");
  });

  test("#TC002 - should get product reviews with pagination and average rating", async () => {
    await createMultipleReviews({
      count: 3,
      commonFields: { product: sampleProductId },
    });

    const res = await request(app).get(`/reviews/product/${sampleProductId}`);
    expect(res.status).toBe(200);
    expect(res.body.reviews.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("averageRating");
  });

  test("#TC003 - should delete a review", async () => {
    const review = await createReview({ creator: sampleUserId });

    const res = await request(app).delete(`/reviews/${review._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Delete review of this product successfully");
  });

  test("#TC004 - should update a review", async () => {
    const review = await createReview({ creator: sampleUserId });

    const res = await request(app).put(`/reviews/${review._id}`).send({
      rating: 4,
      comment: "Updated comment",
      image: "img-updated.jpg",
    });
    expect(res.status).toBe(200);
    expect(res.body.comment).toBe("Updated comment");
  });

  test("#TC005 - should fetch reviews by user", async () => {
    await createMultipleReviews({
      count: 2,
      commonFields: { creator: sampleUserId },
    });

    const res = await request(app).get(`/reviews/user/${sampleUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.findUserReview.length).toBeGreaterThan(0);
  });

  test("#TC006 - should reply to a review as admin", async () => {
    const review = await createReview();

    const res = await request(app)
      .post(`/reviews/reply/${review._id}`)
      .send({ text: "Thanks for your feedback!" });
    expect(res.status).toBe(200);
    expect(res.body.reply.length).toBeGreaterThan(0);
  });

  test("#TC007 - should filter reviews by star rating", async () => {
    await createMultipleReviews({
      count: 5,
      commonFields: { product: sampleProductId, rating: 5 },
    });

    const res = await request(app).get(
      `/reviews/star/${sampleProductId}?star=5`
    );
    expect(res.status).toBe(200);
    expect(res.body.reviews.length).toBeGreaterThan(0);
  });

  test("#TC008 - should get review statistics", async () => {
    await createMultipleReviews({
      count: 4,
      commonFields: { product: sampleProductId },
    });

    const res = await request(app).get(`/reviews/statistic/${sampleProductId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBeGreaterThan(0);
  });
});
