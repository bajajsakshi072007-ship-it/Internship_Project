const Product = require("../models/Product.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, ApiError } = require("../utils/apiResponse");
const { deleteImages, extractImageData } = require("../services/cloudinary.service");
const { PAGINATION } = require("../utils/constants");

// ─────────────────────────────────────────
// @route   GET /api/products
// @desc    Get all products with search, filter, sort, paginate
// @access  Public
// ─────────────────────────────────────────
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort = "newest",
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
  } = req.query;

  const query = { isActive: true, stock: { $gt: 0 } };

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Rating filter
  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  // Sort options
  let sortObj = {};
  switch (sort) {
    case "price_asc":
      sortObj = { price: 1 };
      break;
    case "price_desc":
      sortObj = { price: -1 };
      break;
    case "rating":
      sortObj = { rating: -1 };
      break;
    case "oldest":
      sortObj = { createdAt: 1 };
      break;
    default: // newest
      sortObj = { createdAt: -1 };
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("seller", "name avatar")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(query),
  ]);

  return sendSuccess(res, 200, "Products fetched", products, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// ─────────────────────────────────────────
// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
// ─────────────────────────────────────────
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true })
    .populate("seller", "name avatar bio")
    .populate({
      path: "reviews",
      populate: { path: "buyer", select: "name avatar" },
      options: { sort: { createdAt: -1 }, limit: 10 },
    });

  if (!product) throw new ApiError(404, "Product not found");

  // Related products (same category, exclude current)
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
    stock: { $gt: 0 },
  })
    .populate("seller", "name")
    .limit(4)
    .lean();

  return sendSuccess(res, 200, "Product fetched", { product, related });
});

// ─────────────────────────────────────────
// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Seller only)
// ─────────────────────────────────────────
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, stock, tags } = req.body;

  const images = req.files ? extractImageData(req.files) : [];

  const product = await Product.create({
    seller: req.user._id,
    title,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
    images,
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
  });

  return sendSuccess(res, 201, "Product created successfully", product);
});

// ─────────────────────────────────────────
// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Seller — owner only)
// ─────────────────────────────────────────
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  // Ownership check
  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this product");
  }

  const { title, description, price, category, stock, tags } = req.body;

  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = Number(price);
  if (category) product.category = category;
  if (stock !== undefined) product.stock = Number(stock);
  if (tags) product.tags = Array.isArray(tags) ? tags : [tags];

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const totalImages = product.images.length + req.files.length;
    if (totalImages > 5) {
      throw new ApiError(400, `Cannot add more images. Max 5 allowed, currently have ${product.images.length}.`);
    }
    const newImages = extractImageData(req.files);
    product.images = [...product.images, ...newImages];
  }

  await product.save();
  return sendSuccess(res, 200, "Product updated successfully", product);
});

// ─────────────────────────────────────────
// @route   DELETE /api/products/:id
// @desc    Delete a product and its Cloudinary images
// @access  Private (Seller — owner only)
// ─────────────────────────────────────────
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this product");
  }

  // Delete images from Cloudinary
  await deleteImages(product.images);

  await product.deleteOne();

  return sendSuccess(res, 200, "Product deleted successfully");
});

// ─────────────────────────────────────────
// @route   DELETE /api/products/:id/images/:publicId
// @desc    Remove a specific image from a product
// @access  Private (Seller — owner only)
// ─────────────────────────────────────────
const removeProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  const { publicId } = req.params;
  const decodedPublicId = decodeURIComponent(publicId);

  product.images = product.images.filter((img) => img.publicId !== decodedPublicId);
  await product.save();

  // Delete from Cloudinary
  const { deleteImage } = require("../services/cloudinary.service");
  await deleteImage(decodedPublicId);

  return sendSuccess(res, 200, "Image removed successfully", product);
});

// ─────────────────────────────────────────
// @route   GET /api/products/seller/mine
// @desc    Get seller's own products
// @access  Private (Seller only)
// ─────────────────────────────────────────
const getMyProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = "newest" } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const sortObj = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find({ seller: req.user._id })
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments({ seller: req.user._id }),
  ]);

  return sendSuccess(res, 200, "Seller products fetched", products, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImage,
  getMyProducts,
};
