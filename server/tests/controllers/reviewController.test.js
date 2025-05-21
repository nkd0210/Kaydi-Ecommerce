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

const createAppWithAuth = (user) => {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = user;
    next();
  });

  app.post("/reviews/:userId", reviewController.createReview);
  app.get("/reviews/product/:productId", reviewController.getProductReview);
  app.delete("/reviews/:reviewId", reviewController.deleteProductReview);
  app.put("/reviews/:reviewId", reviewController.editReview);
  app.get("/reviews/user/:userId", reviewController.getUserReview);
  app.post("/reviews/reply/:reviewId", reviewController.replyReview);
  app.get("/reviews/star/:productId", reviewController.sortReviewStar);
  app.get("/reviews/statistic/:productId", reviewController.getReviewStatistic);

  return app;
};

let sampleUserId = new mongoose.Types.ObjectId().toString();
let sampleProductId = new mongoose.Types.ObjectId().toString();
let app;

beforeAll(async () => {
  await connect();
});

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("ReviewController Integration", () => {
  beforeEach(() => {
    app = createAppWithAuth({ id: sampleUserId, isAdmin: true });
  });

  test("#TC001 -  create a review", async () => {
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

  test("#TC002 -  get product reviews with pagination and average rating", async () => {
    await createMultipleReviews({
      count: 3,
      commonFields: { product: sampleProductId },
    });

    const res = await request(app).get(`/reviews/product/${sampleProductId}`);
    expect(res.status).toBe(200);
    expect(res.body.reviews.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("averageRating");
  });

  test("#TC003 -  delete a review", async () => {
    const review = await createReview({ creator: sampleUserId });

    const res = await request(app).delete(`/reviews/${review._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Delete review of this product successfully");
  });

  test("#TC004 -  update a review", async () => {
    const review = await createReview({ creator: sampleUserId });

    const res = await request(app).put(`/reviews/${review._id}`).send({
      rating: 4,
      comment: "Updated comment",
      image: "img-updated.jpg",
    });
    expect(res.status).toBe(200);
    expect(res.body.comment).toBe("Updated comment");
  });

  test("#TC005 -  fetch reviews by user", async () => {
    await createMultipleReviews({
      count: 2,
      commonFields: { creator: sampleUserId },
    });

    const res = await request(app).get(`/reviews/user/${sampleUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.findUserReview.length).toBeGreaterThan(0);
  });

  test("#TC006 -  reply to a review as admin", async () => {
    const review = await createReview();

    const res = await request(app)
      .post(`/reviews/reply/${review._id}`)
      .send({ text: "Thanks for your feedback!" });
    expect(res.status).toBe(200);
    expect(res.body.reply.length).toBeGreaterThan(0);
  });

  test("#TC007 -  filter reviews by star rating", async () => {
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

  test("#TC008 - get review statistics", async () => {
    await createMultipleReviews({
      count: 4,
      commonFields: { product: sampleProductId },
    });

    const res = await request(app).get(`/reviews/statistic/${sampleProductId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBeGreaterThan(0);
  });

  test("#TC009 - create review - unauthorized", async () => {
    const appNonOwner = createAppWithAuth({ id: "otheruser", isAdmin: false });

    const res = await request(appNonOwner)
      .post(`/reviews/${sampleUserId}`)
      .send({
        productIds: [sampleProductId],
        order: new mongoose.Types.ObjectId(),
        rating: 3,
        comment: " not allow",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to create review");
  });

  test("#TC010 - reply review - not admin", async () => {
    const review = await createReview();
    const appNotAdmin = createAppWithAuth({ id: "user", isAdmin: false });

    const res = await request(appNotAdmin)
      .post(`/reviews/reply/${review._id}`)
      .send({ text: "Nice" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to reply this review");
  });

  test("#TC011 - reply review - missing text", async () => {
    const review = await createReview();

    const res = await request(app)
      .post(`/reviews/reply/${review._id}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Reply text is required");
  });

  test("#TC012 - get user review - unauthorized", async () => {
    const otherUserId = new mongoose.Types.ObjectId().toString();
    const appOtherUser = createAppWithAuth({ id: "random", isAdmin: false });

    const res = await request(appOtherUser).get(`/reviews/user/${otherUserId}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to view this");
  });

  test("#TC013 - sort by star - invalid star value", async () => {
    const res = await request(app).get(
      `/reviews/star/${sampleProductId}?star=7`
    );
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid star rating.");
  });

  test("#TC014 - reject review if image contains invalid file types", async () => {
    const res = await request(app)
      .post(`/reviews/${sampleUserId}`)
      .send({
        productIds: [sampleProductId],
        order: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Bad image extension",
        image: ["invalid.bmp", "script.exe"],
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      /must be a valid file with \.jpg, \.jpeg, \.png, or \.webp extension/i
    );
  });

  test("#TC015 - reject review if image size exceeds 20MB", async () => {
    const oversizedBase64 = `data:image/jpeg;base64,${"A".repeat(27_999_999)}`; // ~21MB

    const res = await request(app)
      .post(`/reviews/${sampleUserId}`)
      .send({
        productIds: [sampleProductId],
        order: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Too large image",
        image: [oversizedBase64],
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/valid image.*< 20MB/i);
  });
});
