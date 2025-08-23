const Product = require('../../models/product');
const { sortOrderMap, validProductSortFields } = require('../../utils/maps');

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      colors,
      sizes,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // 🔍 Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.categoryId = category;
    }

    // Filter by color (supports multiple)
    if (colors) {
      query.colors = Array.isArray(colors) ? { $in: colors } : { $in: [colors] };
    }

    // Filter by size
    if (sizes) {
      query['sizes.size'] = Array.isArray(sizes) ? { $in: sizes } : { $in: [sizes] };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.effectivePrice = {};
      if (!isNaN(minPrice)) query.effectivePrice.$gte = Number(minPrice);
      if (!isNaN(maxPrice)) query.effectivePrice.$lte = Number(maxPrice);
    }

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // validate sortBy
    const validSortBy = validProductSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [productsList, totalCount] = await Promise.all([
      Product
        .find(query)
        .populate({ path: 'categoryId', select: 'title' })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ [validSortBy]: sortOrderMap[sortOrder] })
        .populate({
          path: 'categoryId',
          select: 'name -_id',
        })
        .select('-description -story -adminId -metaDescription -updatedAt -images'),

      Product.countDocuments(query)
    ]);

    return res.status(200).json({
      status: true,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      productsList
    });

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = getAllProducts;