import express from "express";
import { createCoupon, deleteCoupon, getAdminCoupons, validateCoupon, validateCouponForOrder } from "../controller/CouponController.js";
import { roleBasedAccess, verifyUserAuth, verifyUserAuthOptional } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/coupon/:code").get(validateCoupon);
router.route("/coupon/validate").post(verifyUserAuthOptional, validateCouponForOrder);
router.route("/admin/coupons")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAdminCoupons)
  .post(verifyUserAuth, roleBasedAccess("admin"), createCoupon);
router.route("/admin/coupon/:id").delete(verifyUserAuth, roleBasedAccess("admin"), deleteCoupon);

export default router;
