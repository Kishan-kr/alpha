const { validationResult } = require("express-validator")
const category = require("../../models/category");
const CustomError = require("../../utilis/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");
const { slugify } = require("../../utilis/generateSlug");

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return the first validation error
      return res.status(400).json({ status: false, error: errors.array()[0]?.msg });
    }

    const { name, description, thumbnail } = req.body;

    // Normalize name
    const normalizedName = name.trim().toLowerCase();

    // Check for duplicates
    const existing = await category.findOne({ name: normalizedName });
    if (existing) {
      throw new CustomError("Category already exists", 409);
    }

    // Build the category object
    const newCategoryData = {
      name: normalizedName,
      description,
      slug: slugify(normalizedName)
    };

    if (thumbnail) {
      newCategoryData.thumbnail = thumbnail;
    }

    const newCategory = new category(newCategoryData);
    await newCategory.save();

    return res.status(201).json({
      status: true,
      message: "Category created successfully",
      category: newCategory
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = createCategory