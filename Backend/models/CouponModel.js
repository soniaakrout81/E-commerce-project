import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["fixed", "percent"],
      default: "percent",
    },
    value: {
      type: Number,
      required: [true, "Coupon value is required"],
      min: [0, "Coupon value cannot be negative"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Coupon expiry date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
