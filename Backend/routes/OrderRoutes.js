import express from "express";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
import { allMyOrders, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/OrderController.js";




const router = express.Router();

router.route("/new/order").post(verifyUserAuth, createNewOrder);
router.route("/order/:id").get(verifyUserAuth, getSingleOrder);
router.route("/admin/order/:id").get(verifyUserAuth,  roleBasedAccess("admin"), getSingleOrder);
router.route("/admin/order/:id").put(verifyUserAuth, roleBasedAccess("admin"), updateOrderStatus);
router.route("/orders/user").get(verifyUserAuth, allMyOrders);
router.route("/admin/orders").get(verifyUserAuth, roleBasedAccess("admin"), getAllOrders);
router.route("/admin/orderUpdate/:id").put(verifyUserAuth, roleBasedAccess("admin"), updateOrderStatus);
router.route("/admin/orderDelete/:id").delete(verifyUserAuth, roleBasedAccess("admin"), deleteOrder);


export default router;
