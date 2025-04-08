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

export const getAuditLogsByFeature = async (req: Request, res: Response) => {
  const { featureId } = req.params;

  try {
    const logs = await prisma.audit_Logs.findMany({
      where: { Features_Id: featureId },
      include: {
        user: true,
        feature: true,
      },
      orderBy: {
        Timestamp: "desc",
      },
    });

    res.status(200).json(logs);
  } catch (err) {
    console.error("Failed to fetch logs for feature", err);
    res.status(500).json({ message: "Internal server error" });
  }
};