/**
 * @jest-environment node
 */
const request = require("supertest");
const express = require("express");
const {
  connect,
  clearDatabase,
  closeDatabase,
} = require("../setup/mongoMemoryServer");

const Category = require("../../models/categoryModel").default;
const categoryController = require("../../controllers/categoryController");
const { createCategory } = require("../helpers/categoryHelper");

const app = express();
app.use(express.json());

// Fake admin middleware
app.use((req, res, next) => {
  req.user = { id: "admin123", isAdmin: true };
  next();
});

// Bind routes
app.post("/category", categoryController.createCategory);
app.get("/category", categoryController.getAllCategories);
app.get("/category/newest", categoryController.getCategoriesFromNewest);
app.get("/category/:categoryId", categoryController.getEachCategory);
app.get("/category-name/:name", categoryController.getCategoryByName);
app.put("/category/:categoryId", categoryController.updateCategory);
app.delete("/category/:categoryId", categoryController.deleteCategory);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Category Controller - Happy Path", () => {
  test("#TC001 - create a category", async () => {
    const res = await request(app)
      .post("/category")
      .send({
        name: "mens",
        title: "Men's Fashion",
        description: ["Stylish clothing for men"],
        heroImage: "mens.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("mens");

    const dbCat = await Category.findOne({ name: "mens" });
    expect(dbCat).not.toBeNull();
    expect(dbCat.title).toBe("Men's Fashion");
  });

  test("#TC002 - get all categories with stats", async () => {
    await createCategory({ name: "womens", title: "Women's Wear" });

    const res = await request(app).get("/category");
    expect(res.status).toBe(200);
    expect(res.body.totalCategory).toBeGreaterThan(0);
    expect(res.body.allCategories.length).toBeGreaterThan(0);
  });

  test("#TC003 - get specific category by ID", async () => {
    const cat = await createCategory({ name: "kids", title: "Kids Zone" });

    const res = await request(app).get(`/category/${cat._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("kids");
  });

  test("#TC004 - update category", async () => {
    const cat = await createCategory({ name: "sport", title: "Sport Wear" });

    const res = await request(app)
      .put(`/category/${cat._id}`)
      .send({
        name: "sport",
        title: "Updated Sports",
        description: ["New description"],
        heroImage: "updated.jpg",
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Sports");

    const updated = await Category.findById(cat._id);
    expect(updated.title).toBe("Updated Sports");
  });

  test("#TC005 - delete category", async () => {
    const cat = await createCategory({ name: "delete-me" });

    const res = await request(app).delete(`/category/${cat._id}`);
    expect(res.status).toBe(200);

    const deleted = await Category.findById(cat._id);
    expect(deleted).toBeNull();
  });

  test("#TC006 - get categories sorted by newest", async () => {
    await createCategory({ name: "cat-a", createdAt: new Date("2020-01-01") });
    await createCategory({ name: "cat-b" }); // latest

    const res = await request(app).get("/category/newest");
    expect(res.status).toBe(200);
    expect(res.body.allCategories[0].name).toBe("cat-b");
  });

  test("#TC007 - get category by name", async () => {
    await createCategory({ name: "byname", title: "By Name" });

    const res = await request(app).get("/category-name/byname");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("By Name");
  });
});
