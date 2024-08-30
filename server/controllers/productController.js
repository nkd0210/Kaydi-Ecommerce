import Product from "../models/productModel.js";

export const createProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to create product" });
  }

  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    categories: req.body.categories,
    sizes: req.body.sizes,
    colors: req.body.colors,
    listingPhotoPaths: req.body.listingPhotoPaths,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const getRecentProduct = async (req, res, next) => {
  try {
    const limitNumber = req.params.limitNumber;
    const limitListing = parseInt(limitNumber);
    const listProduct = await Product.find()
      .limit(limitListing)
      .sort({ createdAt: -1 });
    if (listProduct.length === 0) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json(listProduct);
  } catch (error) {
    next(error);
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    const totalNumber = await Product.countDocuments();

    if (allProducts.length === 0) {
      return res.status(404).json({ message: "No product found" });
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

    const lastWeekProduct = await Product.find({
      createdAt: { $gte: oneWeekAgo },
    });

    const lastMonthProduct = await Product.find({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      totalNumber: totalNumber,
      lastWeekProductCount: lastWeekProduct.length,
      lastMonthProductCount: lastMonthProduct.length,
      lastWeekProduct: lastWeekProduct,
      lastMonthProduct: lastMonthProduct,
      allProducts: allProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to update product" });
  }
  try {
    const productId = req.params.productId;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          categories: req.body.categories,
          sizes: req.body.sizes,
          colors: req.body.colors,
          listingPhotoPaths: req.body.listingPhotoPaths,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to delete product" });
  }
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product delete successfully" });
  } catch (error) {
    next(error);
  }
};

export const getProductByCategory = async (req, res, next) => {
  const category = req.params.category;
  try {
    const findProductByCategory = await Product.find({ categories: category });
    const numberOfProductFound = findProductByCategory.length;

    if (findProductByCategory.length === 0) {
      return res.json({ message: "No product match in this category" });
    }
    res.status(200).json({
      numberOfProductFound,
      findProductByCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getEachProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const findProduct = await Product.findById(productId);
    if (findProduct.length === 0) {
      return res.status(404).json({ message: "No product found!" });
    }
    res.status(200).json(findProduct);
  } catch (error) {
    next(error);
  }
};

export const getProductBySearch = async (req, res, next) => {
  const { searchKey } = req.params;
  try {
    const findProducts = await Product.find({
      name: {
        $regex: searchKey,
        $options: "i",
      },
    });
    if (findProducts.length === 0) {
      return res.json({ message: "No product found with this name" });
    }
    res.status(200).json(findProducts);
  } catch (error) {
    next(error);
  }
};

export const getProductByFilter = async (req, res, next) => {
  const { filterType } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ message: "Invalid products data!" });
  }

  let sortOption = {};

  switch (filterType) {
    case "priceLowToHigh":
      sortOption = (a, b) => a.price - b.price; // ascending
      break;

    case "priceHighToLow":
      sortOption = (a, b) => b.price - a.price; // descending
      break;

    case "nameAZ":
      sortOption = (a, b) =>
        new Intl.Collator("vi", { sensitivity: "base" }).compare(
          a.name,
          b.name
        ); // ascending
      break;

    case "nameZA":
      sortOption = (a, b) =>
        new Intl.Collator("vi", { sensitivity: "base" }).compare(
          b.name,
          a.name
        ); // descending
      break;

    default:
      return res.status(400).json({ message: "Invalid filter type!" });
  }

  try {
    // Sort the products array based on the sortOption
    const sortedProducts = products.sort(sortOption);

    if (sortedProducts.length === 0) {
      return res.json({ message: "No product found!" });
    }

    res.status(200).json(sortedProducts);
  } catch (error) {
    next(error);
  }
};
