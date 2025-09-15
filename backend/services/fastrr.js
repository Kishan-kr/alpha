const axios = require("axios");
const crypto = require("crypto");
const category = require("../models/category");
const { sortOrderMap, validProductSortFields } = require("../utils/maps");
const Product = require("../models/product");
const OrderToken = require("../models/orderToken");

const FASTRR_API_BASE_URL = process.env.FASTRR_API_BASE_URL || 'https://fastrr-api-dev.pickrr.com'
const BASE_FRONTEND_URL = process.env.FRONTEND_URL || 'https://tashn.in'

/**
 * Generate HMAC SHA256 in Base64 for Shiprocket (Fastrr) APIs
 * @param {Object|string} data - The request body (object or JSON string)
 * @param {string} secret - Your API secret
 * @returns {string} - Base64 encoded HMAC string
 */
function generateHmac(data, secret) {
  // If body is object, stringify it
  const message = typeof data === "string" ? data : JSON.stringify(data);

  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");
}

// get checkout token or initiate checkout
const getCheckoutToken = async (req, res) => {
  try {
    // generate redirect token
    const redirectToken = crypto.randomBytes(32).toString('hex');
    
    const body = {
      cart_data: {
        items: req.body.items // frontend sends items
      },
      redirect_url: `${BASE_FRONTEND_URL}/checkout-success?token=${redirectToken}`,
      timestamp: new Date().toISOString()
    };

    const apiKey = process.env.FASTRR_API_KEY;
    const apiSecret = process.env.FASTRR_API_SECRET;

    const hmac = generateHmac(body, apiSecret);

    const response = await axios.post(
      `${FASTRR_API_BASE_URL}/api/v1/access-token/checkout`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
          "X-Api-HMAC-SHA256": hmac
        }
      }
    );

    // Save mapping in DB
    const createdOrderToken = await OrderToken.create({
      token: redirectToken,
      orderId: response?.data?.result?.data?.order_id || null, // order_id if returned by fastrr
      used: false,
      createdAt: new Date(),
    });

    if(createdOrderToken) {
      console.log('Order token stored in DB: ', OrderToken);
    }

    // Response from Fastrr contains token
    res.status(200).json(response.data);
  } catch (err) {
    console.error("Checkout token error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate checkout token" });
  }
};


// verify order token
const verifyOrderToken = async (req, res) => {
  try {
    const { token } = req.query;
    
    const tokenDoc = await OrderToken.findOne({ token });
    
    if (!tokenDoc || tokenDoc.used) {
      console.log('token not found or already used');
      return res.status(400).json({ valid: false });
    }

    // TODO: fetch/validate real order status with Shiprocket API or your DB
    const orderId = tokenDoc.orderId;

    // Mark token as used
    tokenDoc.used = true;
    await tokenDoc.save();

    return res.json({
      valid: true,
      orderId,
    });
  } catch (err) {
    console.error("Order token validation error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to validate order token" });
  }
};


// ** Catalog APIs **
// get All Collections
const getAllCollections = async (req, res) => {
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

    // Map to Shiprocket's required format
    const collections = categories.map(col => ({
      id: col._id.toString(),
      updated_at: col.updatedAt ? col.updatedAt.toISOString() : "",
      created_at: col.createdAt ? col.createdAt.toISOString() : "",
      body_html: col.description || "",
      handle: col.slug || "",
      image: {
        src: col.thumbnail || ""
      },
      title: col.name || ""
    }));

    return res.status(200).json({
      status: true,
      data: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total: total,
        collections,
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

// get All products as well as products of a collection
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      collection_id,
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
    if (collection_id) {
      query.categoryId = collection_id;
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
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ [validSortBy]: sortOrderMap[sortOrder] })
        .populate({
          path: 'categoryId',
          select: 'name -_id',
        })
        .select('-story -adminId -metaDescription -updatedAt -images -discountedPrice -originalPrice'),

      Product.countDocuments(query)
    ]);

    // Map to Shiprocket's required format
    const products = productsList.map(col => ({
      id: col._id.toString(),
      updated_at: col.updatedAt ? col.updatedAt.toISOString() : "",
      created_at: col.createdAt ? col.createdAt.toISOString() : "",
      body_html: col.description?.join(". ") || "",
      handle: col.metaTitle || "",
      image: {
        src: col.thumbnail || ""
      },
      product_type: col.categoryId?.name || "",
      tags: col.tags?.join(", "),
      price: col.effectivePrice || col.originalPrice,
      title: col.title || ""
    }));

    return res.status(200).json({
      status: true,
      data: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        total: totalCount,
        products
      }
    });

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = { getCheckoutToken, getAllCollections, getAllProducts, verifyOrderToken }