import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFeature = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Feature_Name, Feature_Desc, Feature_Status, User_Id, Feature_JiraNo, is_enabled } = req.body;
  
      if (!Feature_Name || !Feature_Desc || Feature_Status === undefined || !User_Id) {
        res.status(400).json({ message: "Missing required fields." });
        return;
      }
  
      //console.log("🛠️ Payload:", req.body);
  
      // Validate user existence
      const user = await prisma.user.findUnique({
        where: { User_Id },
      });
  
      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }
  
      // Create the feature
      const feature = await prisma.feature_Flag.create({
        data: {
          Feature_Name,
          Feature_Desc,
          Feature_Status,
          Feature_JiraNo,
        },
      });
  
      // Assign feature flag to user
      await prisma.flag_Assignment.create({
        data: {
          User_Id,
          Features_Id: feature.Feature_Id,
          is_enabled: is_enabled ?? false, // fallback to false
        },
      });
  
      // Log creation activity
      await prisma.audit_Logs.create({
        data: {
          User_Id,
          Features_Id: feature.Feature_Id,
          Log_Activity: "Created",
        },
      });
  
      res.status(201).json({
        message: "Feature created with flag assignment and audit log.",
        feature,
      });
  
    } catch (error: any) {
      console.error("❌ CREATE FEATURE ERROR:", {
        message: error.message,
        stack: error.stack,
      });
  
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  export const getAllFeatures = async (req: Request, res: Response) => {
    try {
      const features = await prisma.feature_Flag.findMany({
        where: {
          OR: [
            { is_Deleted: false },
            { is_Deleted: null }, // in case older records don't have this field set
          ],
        },
        orderBy: { Date_Created: "desc" },
        include: {
          flagAssignments: {
            include: {
              user: {
                select: {
                  User_FName: true,
                  User_LName: true,
                },
              },
            },
          },
        },
      });
  
      res.json(features);
    } catch (error) {
      console.error("Error fetching features:", error);
      res.status(500).json({ message: "Failed to fetch features" });
    }
  };
  
// ADD is_delete false
// export const getAllFeatures = async (req: Request, res: Response) => {
//     try {
//       const features = await prisma.feature_Flag.findMany({
//         orderBy: { Date_Created: "desc" },
//         include: {
//           flagAssignments: {
//             include: {
//               user: {
//                 select: {
//                   User_FName: true,
//                   User_LName: true,
//                 },
//               },
//             },
//           },
//         },
//       });
  
//       res.json(features);
//     } catch (error) {
//       console.error("Error fetching features:", error);
//       res.status(500).json({ message: "Failed to fetch features" });
//     }
//   };

// export const toggleFeatureStatus = async (req: Request, res: Response) => {
//     const { featureId } = req.params;
//     const { Feature_Status } = req.body;
  
//     try {
//       const updatedFeature = await prisma.feature_Flag.update({
//         where: {
//           Feature_Id: featureId,
//         },
//         data: {
//           Feature_Status: Feature_Status, // ✅ Use the value from frontend
//         },
//       });
  
//       res.json({
//         message: "Feature status updated",
//         updatedFeature,
//       });
//     } catch (error) {
//       console.error("Error updating feature status:", error);
//       res.status(500).json({ message: "Failed to update feature status" });
//     }
// };

export const toggleFeatureStatus = async (req: Request, res: Response): Promise<void> => {
  const { featureId } = req.params;
  const { Feature_Status, User_Id } = req.body;

  if (User_Id === undefined || Feature_Status === undefined) {
    res.status(400).json({ message: "Missing required fields: Feature_Status or User_Id." });
    return;
  }

  try {
    const updatedFeature = await prisma.feature_Flag.update({
      where: { Feature_Id: featureId },
      data: { Feature_Status },
    });

    // Insert into Audit Logs
    await prisma.audit_Logs.create({
      data: {
        User_Id,
        Features_Id: featureId,
        Log_Activity: "Updated Status",
      },
    });

    res.status(200).json({
      message: "Feature status updated and audit logged.",
      updatedFeature,
    });
  } catch (error) {
    console.error("Error updating feature status:", error);
    res.status(500).json({ message: "Failed to update feature status" });
  }
};
// export const handleEditFeature = async (req: Request, res: Response) => {

// };

export const updateFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { Feature_Name, Feature_Desc, Feature_Status, Feature_JiraNo, User_Id } = req.body;

    if (!Feature_Name || !Feature_Desc || Feature_Status === undefined|| !User_Id) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    console.log("✏️ Updating Feature:", { id, ...req.body });

    // Check if the feature exists
    const existingFeature = await prisma.feature_Flag.findUnique({
      where: { Feature_Id: id },
    });

    if (!existingFeature) {
      res.status(404).json({ message: "Feature not found." });
      return;
    }

    // Update the feature
    const updatedFeature = await prisma.feature_Flag.update({
      where: { Feature_Id: id },
      data: {
        Feature_Name,
        Feature_Desc,
        Feature_Status,
        Feature_JiraNo,
        // is_updated: true, // Uncomment if needed
      },
    });

    // Insert into Audit Logs
    await prisma.audit_Logs.create({
      data: {
        User_Id,
        Features_Id: id,
        Log_Activity: "Edited Details",
      },
    });

    res.status(200).json({
      message: "Feature updated successfully.",
      feature: updatedFeature,
    });

  } catch (error: any) {
    console.error("❌ UPDATE FEATURE ERROR:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const deleteFeature = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { User_Id } = req.body; // required for audit log

  if (!User_Id) {
    res.status(400).json({ message: "Missing User_Id in request body." });
    return;
  }

  try {
    // Soft delete the feature
    const feature = await prisma.feature_Flag.update({
      where: { Feature_Id: id },
      data: {
        is_Deleted: true,
      },
    });

    // Log the deletion in audit logs
    await prisma.audit_Logs.create({
      data: {
        User_Id,
        Features_Id: id,
        Log_Activity: "Deleted",
      },
    });

    res.status(200).json({ message: "Feature soft-deleted successfully.", feature });
  } catch (error: any) {
    console.error("❌ DELETE FEATURE ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
