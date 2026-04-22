import Coupon from "../models/CouponModel.js";
import HandleAsyncError from "../middleware/HandleAsyncError.js";
import HandelError from "../utils/handelError.js";

const serializeCoupon = (coupon, orderAmount = 0) => {
  const value = coupon.type === "percent"
    ? Math.min((orderAmount * coupon.value) / 100, orderAmount)
    : Math.min(coupon.value, orderAmount);

  return {
    coupon,
    discountAmount: Number(value.toFixed(2)),
  };
};

export const getAdminCoupons = HandleAsyncError(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    coupons,
  });
});

export const createCoupon = HandleAsyncError(async (req, res, next) => {
  const { code, type, value, minOrderAmount, expiresAt, isActive } = req.body;

  if (!code || !value || !expiresAt) {
    return next(new HandelError("Code, value, and expiry date are required", 400));
  }

  const coupon = await Coupon.create({
    code,
    type,
    value,
    minOrderAmount,
    expiresAt,
    isActive,
  });

  res.status(201).json({
    success: true,
    coupon,
  });
});

export const deleteCoupon = HandleAsyncError(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new HandelError("Coupon not found", 404));
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

export const validateCoupon = HandleAsyncError(async (req, res, next) => {
  const code = req.params.code?.trim()?.toUpperCase();
  const orderAmount = Number(req.query.orderAmount || 0);

  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) {
    return next(new HandelError("Coupon not found", 404));
  }

  if (coupon.expiresAt < new Date()) {
    return next(new HandelError("Coupon has expired", 400));
  }

  if (orderAmount < coupon.minOrderAmount) {
    return next(new HandelError(`Order must be at least ${coupon.minOrderAmount}`, 400));
  }

  const result = serializeCoupon(coupon, orderAmount);

  res.status(200).json({
    success: true,
    ...result,
  });
});
