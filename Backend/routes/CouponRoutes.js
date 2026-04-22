import express from "express";
import { createCoupon, deleteCoupon, getAdminCoupons, validateCoupon } from "../controller/CouponController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/coupon/:code").get(validateCoupon);
router.route("/admin/coupons")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAdminCoupons)
  .post(verifyUserAuth, roleBasedAccess("admin"), createCoupon);
router.route("/admin/coupon/:id").delete(verifyUserAuth, roleBasedAccess("admin"), deleteCoupon);

export default router;
