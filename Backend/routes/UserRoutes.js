import express from "express";
import {registerUser, loginUser, logout, reqestPasswordReset, resetPassword, getUserDetails, updatePassword, updateProfile, getUserList, getSingleUser, updateUserRole, deleteUser} from "../controller/UserController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/password/forgot").post(reqestPasswordReset);
router.route("/reset/:token").post(resetPassword);
router.route("/profile").get(verifyUserAuth, getUserDetails);
router.route("/password/change").put(verifyUserAuth, updatePassword);
router.route("/profile/update").put(verifyUserAuth, updateProfile);
router.route("/admin/usersList").get(verifyUserAuth, roleBasedAccess("admin"), getUserList);
router.route("/admin/user/:id").get(verifyUserAuth, roleBasedAccess("admin"), getSingleUser);
router.route("/admin/userRole/:id").put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole);
router.route("/admin/userDelete/:id").delete(verifyUserAuth, roleBasedAccess("admin"), deleteUser);


export default router;