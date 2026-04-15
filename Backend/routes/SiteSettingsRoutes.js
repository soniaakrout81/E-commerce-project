import express from "express";
import { getPublicSiteSettings, updateSiteSettings } from "../controller/SiteSettingsController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/settings").get(getPublicSiteSettings);
router.route("/admin/settings").put(verifyUserAuth, roleBasedAccess("admin"), updateSiteSettings);

export default router;
