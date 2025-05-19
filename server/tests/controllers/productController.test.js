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
} = require("../setup/mongoMemoryServer");

const Product = require("../../models/productModel").default;
const productController = require("../../controllers/productController");
const { createProduct } = require("../helpers/productHelper");

const app = express();
app.use(express.json());

// Fake admin middleware
app.use((req, res, next) => {
  req.user = { id: "admin123", isAdmin: true };
  next();
});

// Bind routes
app.post("/product/create", productController.createProduct);
app.get("/product/recent/:limitNumber", productController.getRecentProduct);
app.get("/product/all", productController.getAllProduct);
app.get("/product/pagination", productController.getProductPagination);
app.put("/product/update/:productId", productController.updateProduct);
app.delete("/product/delete/:productId", productController.deleteProduct);
app.get("/product/each/:productId", productController.getEachProduct);
app.get("/product/search/:searchKey", productController.getProductBySearch);
app.get("/product/category/:category", productController.getProductByCategory);
app.get("/product/price", productController.getProductByPriceRange);
app.post("/product/filter/:filterType", productController.getProductByFilter);
app.get(
  "/product/combination/:category",
  productController.getProductCombination
);
app.get(
  "/product/recommend/:productId",
  productController.getRecommendProducts
);
app.get(
  "/product/search-admin/:searchKey",
  productController.searchProductAdmin
);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Product Controller", () => {
  test("#TC001 - create product and check DB", async () => {
    const res = await request(app)
      .post("/product/create")
      .send({
        name: "Test Product",
        description: "A great product",
        price: 100,
        stock: 10,
        categories: ["shirt"],
        sizes: ["M"],
        colors: ["Red"],
        listingPhotoPaths: ["img1.jpg"],
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Product");

    const inDb = await Product.findOne({ name: "Test Product" });
    expect(inDb).not.toBeNull();
    expect(inDb.price).toBe(100);
  });

  test("#TC002 - get recent products", async () => {
    await createProduct({ name: "Recent" });
    const res = await request(app).get("/product/recent/1");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe("Recent");
  });

  test("#TC003 - get all products", async () => {
    await createProduct({ name: "Full" });
    const res = await request(app).get("/product/all");
    expect(res.status).toBe(200);
    expect(res.body.totalNumber).toBe(1);
    expect(res.body.allProducts[0].name).toBe("Full");
  });

  test("#TC004 - get paginated products", async () => {
    await createProduct({ name: "Paginated" });
    const res = await request(app).get("/product/pagination?page=1&limit=1");
    expect(res.status).toBe(200);
    expect(res.body.listProducts.length).toBeGreaterThan(0);
    expect(res.body.listProducts[0].name).toBe("Paginated");
  });

  test("#TC005 - update product and verify DB", async () => {
    const product = await createProduct({ name: "Old" });
    const res = await request(app)
      .put(`/product/update/${product._id}`)
      .send({
        name: "Updated",
        description: "Updated desc",
        price: 200,
        stock: 5,
        categories: ["pants"],
        sizes: ["L"],
        colors: ["Black"],
        listingPhotoPaths: ["img2.jpg"],
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated");

    const updated = await Product.findById(product._id);
    expect(updated.name).toBe("Updated");
    expect(updated.price).toBe(200);
  });

  test("#TC006 - delete product and verify DB", async () => {
    const product = await createProduct({ name: "ToDelete" });
    const res = await request(app).delete(`/product/delete/${product._id}`);
    expect(res.status).toBe(200);

    const inDb = await Product.findById(product._id);
    expect(inDb).toBeNull();
  });

  test("#TC007 - get specific product by ID", async () => {
    const product = await createProduct({ name: "Specific" });
    const res = await request(app).get(`/product/each/${product._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Specific");
  });

  test("#TC008 - search by keyword", async () => {
    await createProduct({ name: "Searchable" });
    const res = await request(app).get("/product/search/Searchable");
    expect(res.status).toBe(200);
    expect(res.body.findProducts.length).toBeGreaterThan(0);
  });

  test("#TC009 - filter by category", async () => {
    await createProduct({ name: "CatProd", categories: ["accessory"] });
    const res = await request(app).get("/product/category/accessory");
    expect(res.status).toBe(200);
    expect(res.body.findProductByCategory.length).toBeGreaterThan(0);
  });

  test("#TC010 - filter by price range", async () => {
    await createProduct({ name: "PriceRange", price: 150 });
    const res = await request(app).get(
      "/product/price?minPrice=100&maxPrice=200"
    );
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  test("#TC011 - sort by nameAZ", async () => {
    const products = [
      { name: "Zeta", price: 100 },
      { name: "Alpha", price: 50 },
    ];
    const res = await request(app)
      .post("/product/filter/nameAZ")
      .send({ products });
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Alpha");
  });

  test("#TC012 - filter by combination of category + price", async () => {
    await createProduct({ name: "Combo", price: 120, categories: ["shirt"] });
    const res = await request(app).get(
      "/product/combination/shirt?minPrice=100&maxPrice=200"
    );
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  test("#TC013 - recommend products based on related category", async () => {
    const main = await createProduct({
      name: "Recommender",
      categories: ["shirt"],
    });
    await createProduct({ name: "Recommended", categories: ["pants"] });

    const res = await request(app).get(`/product/recommend/${main._id}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("#TC014 - search product as admin", async () => {
    await createProduct({ name: "AdminProd" });
    const res = await request(app).get("/product/search-admin/AdminProd");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("#TC015 - create product - unauthorized user", async () => {
    const appNonAdmin = express();
    appNonAdmin.use(express.json());
    appNonAdmin.use((req, res, next) => {
      req.user = { id: "user123", isAdmin: false };
      next();
    });
    appNonAdmin.post("/product/create", productController.createProduct);

    const res = await request(appNonAdmin).post("/product/create").send({
      name: "Fake",
      price: 100,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to create product");
  });

  test("#TC016 - get recent product - no products", async () => {
    const res = await request(app).get("/product/recent/5");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No product found");
  });

  test("#TC017 - get all products - empty DB", async () => {
    const res = await request(app).get("/product/all");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No product found");
  });

  test("#TC018 - get pagination - no products", async () => {
    const res = await request(app).get("/product/pagination?page=1&limit=1");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No product found");
  });

  test("#TC019 - update product - not admin", async () => {
    const product = await createProduct({ name: "ToUpdate" });

    const appNonAdmin = express();
    appNonAdmin.use(express.json());
    appNonAdmin.use((req, res, next) => {
      req.user = { id: "user123", isAdmin: false };
      next();
    });
    appNonAdmin.put(
      "/product/update/:productId",
      productController.updateProduct
    );

    const res = await request(appNonAdmin)
      .put(`/product/update/${product._id}`)
      .send({ name: "FailUpdate" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to update product");
  });

  test("#TC020 - delete product - not admin", async () => {
    const product = await createProduct();

    const appNonAdmin = express();
    appNonAdmin.use(express.json());
    appNonAdmin.use((req, res, next) => {
      req.user = { id: "user123", isAdmin: false };
      next();
    });
    appNonAdmin.delete(
      "/product/delete/:productId",
      productController.deleteProduct
    );

    const res = await request(appNonAdmin).delete(
      `/product/delete/${product._id}`
    );

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to delete product");
  });

  test("#TC021 - get product by ID - not found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/product/each/${id}`);

    expect(res.status).toBe(404);
  });

  test("#TC022 - search product - keyword not matched", async () => {
    const res = await request(app).get("/product/search/nonexistent");
    expect(res.body.message).toBe("No product found with this name");
  });

  test("#TC023 - filter by category - empty", async () => {
    const res = await request(app).get("/product/category/fake-category");
    expect(res.body.message).toBe("No product match in this category");
  });

  test("#TC024 - invalid filter type", async () => {
    const res = await request(app)
      .post("/product/filter/invalidFilter")
      .send({ products: [] });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid filter type!");
  });

  test("#TC025 - combination filter - no match", async () => {
    const res = await request(app).get(
      "/product/combination/shirt?minPrice=9999&maxPrice=10000"
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No products match your criteria.");
  });

  test("#TC026 - recommend - no match", async () => {
    const prod = await createProduct({ name: "Solo", categories: ["rare"] });
    const res = await request(app).get(`/product/recommend/${prod._id}`);
    expect(res.body.message).toBe("No product match in this category");
  });

  test("#TC027 - search as admin - unauthorized", async () => {
    const appNonAdmin = express();
    appNonAdmin.use(express.json());
    appNonAdmin.use((req, res, next) => {
      req.user = { id: "nonadmin", isAdmin: false };
      next();
    });
    appNonAdmin.get(
      "/product/search-admin/:searchKey",
      productController.searchProductAdmin
    );

    const res = await request(appNonAdmin).get("/product/search-admin/Test");
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("You are not admin to perform this action.");
  });

  test("#TC028 - filter - invalid payload", async () => {
    const res = await request(app)
      .post("/product/filter/nameAZ")
      .send({ products: "not-an-array" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid products data!");
  });
});
