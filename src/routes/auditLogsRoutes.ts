import express from "express";
import { getAllLogs, getAuditLogsByFeature} from "../controller/admin/auditlogsController";

const router = express.Router();

router.get("/", getAllLogs); // GET /api/logs
router.get("/feature/:featureId", getAuditLogsByFeature);

export default router;