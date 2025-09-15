const category = require("../../models/category")

const getAllCategory = async (req, res) => {
  try {
    // Parse query params, fallback to defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Query paginated data
    const categories = await category.find()
      .skip(skip)
      .limit(limit);

    // Total count for pagination info
    const total = await category.countDocuments();

    return res.status(200).json({
      status: true,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      categories,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = getAllCategory