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
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to view all product" });
  }
  try {
    const allProducts = await Product.find();
    const totalNumber = await Product.countDocuments();

    if (allProducts.length === 0) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json({
      totalNumber: totalNumber,
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
      return res
        .status(404)
        .json({ message: "No product match in this category" });
    }
    res.status(200).json({
      numberOfProductFound,
      findProductByCategory,
    });
  } catch (error) {
    next(error);
  }
};
