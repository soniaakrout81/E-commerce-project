import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";
import HandelError from "../utils/handelError.js";
import HandleAsyncError from "../middleware/HandleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import { v2 as cloudinary } from "cloudinary";

/* =========================
   1️⃣ Creating Products
========================= */
export const createProducts = async (req, res, next) => {
  try {
    console.log("Req.body received:", req.body);

    const { name, price, description, keywords, stock, image, category } = req.body;

    if (!image || image.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let imagesLinks = [];

    for (let i = 0; i < image.length; i++) {
      console.log(`Uploading image ${i + 1} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(image[i], {
        folder: "products",
      });
      console.log("Cloudinary upload result:", result);

      imagesLinks.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      keywords: keywords || "",
      stock,
      category: category || "Default",
      image: imagesLinks,
    });

    console.log("Product created successfully:", product);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    next(error); // this will be caught by your catchAsyncErrors middleware
  }
};

/* =========================
   2️⃣ Get all Products
========================= */
export const getAllProducts = HandleAsyncError(async (req, res, next) => {
  console.log("===== GET ALL PRODUCTS =====");
  console.log("Query params:", req.query);

  const resultPerPage = Number(req.query.limit) || 8;
  console.log("Result per page:", resultPerPage);

  const apiFeatures = new APIFunctionality(Product.find(), req.query);
  apiFeatures.search();
  apiFeatures.filter();

  console.log("Mongo query after search & filter:", apiFeatures.query.getQuery());

  // نسخ الاستعلام لحساب عدد المنتجات
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();
  console.log("Filtered product count:", productCount);

  const totalPages = Math.ceil(productCount / resultPerPage);
  const page = Number(req.query.page) || 1;
  console.log("Page:", page, "Total pages:", totalPages);

  if (page > totalPages && productCount > 0) {
    console.log("Page requested exceeds total pages!");
    return next(new HandelError("This page doesn't exist", 404));
  }

  apiFeatures.pagination(resultPerPage);
  const products = await apiFeatures.query;
  console.log("Products fetched:", products.length);

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    totalPages,
    currentPage: page,
  });
});


/* =========================
   3️⃣ Update product
========================= */
export const updateProduct = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) {
    return next(new HandelError("Product not found", 404));
  }


  if (req.body.image) {


    for (let i = 0; i < product.image.length; i++) {
      if (product.image[i].publicId) {
        await cloudinary.uploader.destroy(product.image[i].publicId);
      }
    }

    let images = [];


    if (typeof req.body.image === "string") {
      images.push(req.body.image);
    } else {
      images = req.body.image;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "The product has been successfully updated",
    product,
  });
});


/* =========================
   4️⃣ delete product
========================= */
export const deleteProduct = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new HandelError("Product not found", 404));
  }

  for (let img of product.image) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  const deletedOrdersResult = await Order.deleteMany({
    "orderItems.product": product._id,
  });

  console.log("[ADMIN_PRODUCT_DELETE] Related orders deleted", {
    productId: product._id.toString(),
    deletedOrdersCount: deletedOrdersResult.deletedCount || 0,
  });

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "the product has seccessfully deleted",
    deletedOrdersCount: deletedOrdersResult.deletedCount || 0,
  });
});

/* =========================
   5️⃣ accessing single product
========================= */
export const accessingSingleProduct = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new HandelError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/* =========================
   6️⃣ creating and updating review
========================= */
export const createRiviewForProduct = HandleAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!rating || !comment || !productId) {
    return next(new HandelError("Please provide all review fields", 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandelError("Product not found", 404));
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  // البحث عن review موجود للمستخدم
const reviewIndex = product.reviews.findIndex((r) => {
  console.log("Review user:", r.user, "Current user:", req.user._id);
  return r.user && r.user.toString() === req.user._id.toString();
});


  if (reviewIndex !== -1) {
    // تحديث review موجود
    product.reviews[reviewIndex].rating = Number(rating); // ⚡ تأكد من استخدام 'rating' وليس 'ratings'
    product.reviews[reviewIndex].comment = comment;
  } else {
    // إنشاء review جديدة
    product.reviews.push(review);
  }

  // تحديث عدد الريفيوز والمتوسط
  product.numOfReviews = product.reviews.length;
  const sumRatings = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  product.ratings = product.reviews.length > 0 ? sumRatings / product.reviews.length : 0;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: reviewIndex !== -1 ? "Review updated successfully" : "Review added successfully",
  });
});


/* =========================
   7️⃣ getting reviews
========================= */
export const getProductReviews = HandleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandelError("Product not found", 400));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

/* =========================
   8️⃣ delete reviews
========================= */
export const deleteProductReview = HandleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandelError("Product not found", 400));
  }

  const reviewExists = product.reviews.find(
    (r) => r._id.toString() === req.query.id.toString()
  );

  if (!reviewExists) {
    return next(new HandelError("Review not found", 404));
  }

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.query.id.toString()
  );

  let sum = 0;
  product.reviews.forEach((r) => {
    sum += r.rating;
  });

  product.ratings =
    product.reviews.length > 0 ? sum / product.reviews.length : 0;
  product.numOfReviews = product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    product,
  });
});

/* =========================
   9️⃣ admin - getting all products
========================= */
export const getAdminProducts = HandleAsyncError(async (req, res, next) => {
  const products = await Product.find();
  const productCount = products.length;

  res.status(200).json({
    success: true,
    productCount,
    products,
  });
});
