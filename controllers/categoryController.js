import category from "../models/category.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required!",
      });
    }
    const existingCategory = await category.findOne({ name });
    if (existingCategory) {
      res.status(200).send({
        success: true,
        message: "Category already exists!",
      });
    }
    const newCategory = await new category({
      name,
      slug: slugify(name),
    }).save();

    if (newCategory)
      res.status(200).send({
        success: true,
        message: "New Category created!",
        data: newCategory,
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category creation api",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const categoryUpdate = await category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    if (categoryUpdate) {
      res.status(200).send({
        success: true,
        message: "Category updated successfully!",
        categoryUpdate,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Category update!",
      error,
    });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const allCategories = await category.find({});
    res.status(200).send({
      allCategories,
      message: " List of all categories",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      error,
      success: false,
      message: "Error fetching categories!",
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoryData = await category.findOne({ slug: slug });
    if (categoryData)
      res.status(200).send({
        categoryData,
        message: "Category Data by name!",
        success: true,
      });
    else
      res.status(200).send({
        message: "Oops! No info found",
        categoryData,
        success: true,
      });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching single category info!",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await category.findByIdAndDelete(id);
    if (deleteCategory)
      res.status(200).send({
        success: true,
        message: "Category deleted successfully!",
        deleteCategory,
      });
    else
      res.status(200).send({
        success: true,
        message: "Category was not found!",
      });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in Deleting Category", error });
  }
};
