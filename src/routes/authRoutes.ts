import express from "express";
import { loginUser } from "../controller/users/auth"; // Ensure correct path

const router = express.Router();

router.post("/login", loginUser); // Directly use loginUser without wrapping it

export default router;
