const category = require("../../models/category");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");
const CustomError = require("../../utilis/customError");

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new CustomError('Category ID is required', 400);
    }
    
    const foundCategory = await category.findById(id);

    if (!foundCategory) {
      throw new CustomError('Category not found', 404);
    }

    return res.status(200).json({ status: true, category: foundCategory });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = getCategoryById