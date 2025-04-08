import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        // Query user from database
        const user = await db.user.findUnique({
            where: { User_Email: email },
        });

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Compare passwords
        //const isMatch = await bcrypt.compare(password, user.User_Password);
        const isMatch = password === user.User_Password;
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.User_Id, email: user.User_Email }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ 
            message: "Login successful", 
            token, 
            user: { 
              User_Id: user.User_Id,         // ✅ match frontend expectation
              User_Email: user.User_Email,
              User_Role: user.User_Role
            }
          });      
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
