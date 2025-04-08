import express from "express";
import { createFeature, getAllFeatures, toggleFeatureStatus, updateFeature, deleteFeature } from "../controller/admin/featureAdminController";

const router = express.Router();

router.get("/", getAllFeatures);
router.post("/", createFeature);
//router.put("/:featureId/toggle", toggleFlagAssignment);
router.put("/:featureId/toggle", toggleFeatureStatus);

router.put("/:id", updateFeature);

router.patch("/:id/delete", deleteFeature);
export default router; 
