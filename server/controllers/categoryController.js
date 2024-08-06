import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

export const createCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to create category" });
  }

  const { name, title, description } = req.body;
  const newCategory = new Category({
    name,
    title,
    description,
  });

  try {
    const savedCategory = await newCategory.save();
    return res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const findAllCategory = await Category.find().sort({ createdAt: -1 });
    const totalCategory = await Category.countDocuments();

    if (findAllCategory.length === 0) {
      return res.status(404).json({ message: "No category found" });
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

    const lastWeekCategory = await Category.find({
      createdAt: { $gte: oneWeekAgo },
    });

    const lastMonthCategory = await Category.find({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      totalCategory: totalCategory,
      lastWeekCategoryCount: lastWeekCategory.length,
      lastWeekCategory: lastWeekCategory,
      lastMonthCategoryCount: lastMonthCategory.length,
      lastMonthCategory: lastMonthCategory,
      allCategories: findAllCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to delete category" });
  }
  try {
    const categoryId = req.params.categoryId;
    await Category.findByIdAndDelete(categoryId);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to update category" });
  }
  const categoryId = req.params.categoryId;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: {
          name: req.body.name,
          title: req.body.title,
          description: req.body.description,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const getEachCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to view this category" });
  }
  const categoryId = req.params.categoryId;
  try {
    const findCategory = await Category.findById(categoryId);
    if (findCategory.length === 0) {
      return res
        .status(404)
        .json({ message: "No category found with this id" });
    } else {
      return res.status(200).json(findCategory);
    }
  } catch (error) {
    next(error);
  }
};
