import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.audit_Logs.findMany({
      include: {
        user: true,
        feature: true,
      },
      orderBy: {
        Timestamp: "desc",
      },
    });

    res.json(logs);
  } catch (error) {
    console.error("❌ Error fetching logs:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};