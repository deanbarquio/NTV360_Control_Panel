import express from "express";
import { getAllLogs } from "../controller/admin/auditlogsController";

const router = express.Router();

router.get("/", getAllLogs); // GET /api/logs

export default router;