// types.ts

export interface User {
  User_Id: string;
  User_FName: string;
  User_LName: string;
  User_Email: string;
  User_Role: string;
  User_Password: string;
  is_Active: boolean;
}

export interface FlagAssignment {
  Assignment_Id: string;
  User_Id: string;
  Features_Id: string;
  is_enabled: boolean;
  Date_Created: string;
  user: User; // ✅ nested user for dev name display
}

export interface Feature {
  Feature_Id: string;
  Feature_Name: string;
  Feature_Desc: string;
  Feature_Status: boolean;
  Date_Created: string;
  is_Deleted?: boolean;
  Feature_JiraNo?: string;
  flagAssignments?: FlagAssignment[]; // ✅ include this to fix your error
}

// export interface AuditLog {
//   Log_Id: string;
//   User_Id: string;
//   Features_Id: string;
//   Log_Activity: string;
//   Timestamp: string;
//   user: {
//     User_FName: string;
//     User_LName: string;
//   };
//   feature: {
//     Feature_Name: string;
//   };
// }
export interface Audit {
  Log_Id: string;
  Log_Activity: string;
  Timestamp: string;
  user?: {
    User_FName: string;
    User_LName: string;
  };
  feature?: {
    Feature_Name: string;
  };
}


