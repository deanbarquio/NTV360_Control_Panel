import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateUserModal from "../../modals/create_user_modal";
import { Feature, Audit } from "../../types";
import axios from "axios";
import { toast } from "react-toastify"; 

// Modals
import FeatureDetailsModal from "../../modals/feature_details_modal";
import ConfirmationModal from "../../modals/toggle_confimation_modal"
import SuccessModal from "../../modals/success_modal"
import DeleteConfirmationModal from "../../modals/delete_confirmation_modal"
import AuditLogModal from "../../modals/log_details_modal"

// Icons
import CopyIcon from "../../assets/copy_feature_icon.jpg"
import EditIcon from "../../assets/edit_feature_icon.png"
import DeleteIcon from "../../assets/delete_feature_icon.png"


const Admin_Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
 // const [features, setFeatures] = useState([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [logs, setLogs] = useState<Audit[]>([]);
  // loading,
  const [loading, setLoading] = useState(true);
  const [pendingToggleFeatureId, setPendingToggleFeatureId] = useState<string | null>(null);
  // const [toggleActionType, setToggleActionType] = useState<"enable" | "disable">("enable");
  // const [currentToggleStatus, setCurrentToggleStatus] = useState<boolean>(false);
  const [pendingToggleStatus, setPendingToggleStatus] = useState<boolean>(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [auditCount, setAuditCount] = useState(0);

     const [isConfirmOpen, setIsConfirmOpen] = useState(false);
      const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
      const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

      const [selectedLog, setSelectedLog] = useState<Audit | null>(null);
      const [isLogModalOpen, setIsLogModalOpen] = useState(false);
      

useEffect(() => {
  const fetchCounts = async () => {
    try {
      const featuresRes = await axios.get("/api/features");
      const logsRes = await axios.get("/api/logs");
  
      const features = featuresRes.data;
      const logs = logsRes.data;
  
      const active = features.filter(
        (f: Feature) => f.Feature_Status === true
      ).length;
      
      const inactive = features.filter(
        (f: Feature) => f.Feature_Status === false
      ).length;
      
      setActiveCount(active);
      setInactiveCount(inactive);
      setAuditCount(logs.length); // ✅
    } catch (err) {
      console.error("❌ Failed to fetch counts:", err);
    }
  };
  fetchCounts();
}, []);

useEffect(() => {
  const storedId = localStorage.getItem("userId");
    setUserId(storedId);
    console.log("🧠 Admin Dashboard UserID:", storedId);

    if (!storedId) {
      alert("Session expired. Please log in again.");
      navigate("/");
    }
}, []);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await axios.get("/api/features");
        setFeatures(res.data);
      } catch (err) {
        console.error("Failed to fetch features", err);
      }
    };

    fetchFeatures();
  }, []);

useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
}, []);

const fetchFeatures = async () => {
  try {
    const res = await axios.get("/api/features");
      setFeatures(res.data);
  } catch (error) {
      console.error("Failed to fetch features", error);
  } finally {
      setLoading(false);
  }
};

const openFeatureDetails = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDetailsOpen(true);
};


// const handleToggle = async (featureId: string, currentStatus: boolean) => {
//   try {
//     await axios.put(`/api/features/${featureId}/toggle`, {
//       Feature_Status: !currentStatus,
//     });

//     setFeatures((prev) =>
//       prev.map((f) =>
//         f.Feature_Id === featureId ? { ...f, Feature_Status: !currentStatus } : f
//       )
//     );
//   } catch (error) {
//     console.error("Toggle failed:", error);
//   }
// };

useEffect(() => {
    fetchFeatures();
}, []);

const handleToggleFlagAssignment = async (featureId: string, currentStatus: boolean) => {
  try {
      await axios.put(`/api/flag-assignment/${featureId}/toggle`, {
        is_enabled: !currentStatus,
      });
      fetchFeatures();
      } catch (err) {
      console.error("Flag toggle failed", err);
      }
};

const requestToggleConfirmation = (featureId: string, currentStatus: boolean) => {
    setPendingToggleFeatureId(featureId);
    setPendingToggleStatus(!currentStatus); // this will be the *new* value
    setConfirmToggle(true);
};

const confirmToggleFeature = async () => {
  if (!pendingToggleFeatureId) return;
  
  try {
    await axios.put(`/api/features/${pendingToggleFeatureId}/toggle`, {
      Feature_Status: pendingToggleStatus,
      User_Id: userId,
    });
  
    setFeatures((prev) =>
      prev.map((f) =>
        f.Feature_Id === pendingToggleFeatureId
          ? { ...f, Feature_Status: pendingToggleStatus }
          : f
      )
    );
  } catch (error) {
    console.error("Toggle failed:", error);
  } finally {

    setConfirmToggle(false);
    setPendingToggleFeatureId(null);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

const handleEditFeature = async (updatedFeature: Feature) => {
  try {
    const res = await axios.put(`/api/features/${updatedFeature.Feature_Id}`, {
      Feature_Name: updatedFeature.Feature_Name,
      Feature_Desc: updatedFeature.Feature_Desc,
      Feature_Status: updatedFeature.Feature_Status,
      Feature_JiraNo: updatedFeature.Feature_JiraNo,
      User_Id: updatedFeature.flagAssignments?.[0]?.User_Id, // assuming this is passed from backend
    });

    toast.success("✅ Feature updated successfully");

    setShowSuccessModal(true);

    fetchFeatures(); // your function to refetch all features
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error("❌ Error updating feature:", error);
    toast.error("Failed to update feature");
  }
};

const handleDeleteFeature = async (
  featureId: string,
  userId: string | null
) => {
  if (!userId) {
    toast.error("Missing user ID");
    return;
  }

  try {
    console.log("Deleting feature:", featureId, "by user:", userId);

    await axios.patch(`/api/features/${featureId}/delete`, {
      User_Id: userId,
    });
    setIsDeleteSuccessOpen(true);
    toast.success("🗑️ Feature deleted successfully");
    fetchFeatures(); // Refresh the table/list
  } catch (err: any) {
    console.error("❌ Delete failed:", err?.response || err);
    toast.error(
      err?.response?.data?.message || "Delete failed. Please try again."
    );
  }
};

return (
  <div className="flex overflow-hidden bg-[#E3EBDC]">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-900 flex flex-col p-6 shrink-0">
      <h2 className="text-2xl font-bold mb-8 tracking-widest text-white">NTV360</h2>
      <nav className="flex flex-col space-y-4 text-white">
        <button
          className="hover:text-amber-400 text-left"
          onClick={() => navigate("/admindashboard")}
        >
          Dashboard
        </button>
        <button
          className="hover:text-amber-400 text-left"
          onClick={() => navigate("/adminAuditLogs")}
        >
          Audit Logs
        </button>
        <button
          className="hover:text-amber-400 text-left"
          onClick={() => navigate("/adminfeatures")}
        >
          Features
        </button>
      </nav>
    </aside>

    {/* Main Content Area */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shrink-0">
        <div className="text-slate-900 text-xl font-bold">
          Welcome, Admin Samantha!
          <p className="text-sm text-gray-500">Welcome to your tech control center</p>
        </div>
        <button
          className="bg-[#8CB454] text-white font-medium px-4 py-2 rounded-md transition"
          onClick={() => setShowModal(true)}
        >
          + Create User
        </button>
      </header>

      {/* Scrollable Inner Content */}
      <main className="flex-1 px-6 pb-6 space-y-6">
        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="h-20 bg-white rounded-2xl shadow-md p-6 flex items-center gap-6">
            <h2 className="text-lg font-semibold text-gray-700">Total Active</h2>
            <p className="text-3xl font-bold text-amber-500">{activeCount}</p>
          </div>
          <div className="h-20 bg-white rounded-2xl shadow-md p-6 flex items-center gap-6">
            <h2 className="text-lg font-semibold text-gray-700">Total Inactive</h2>
            <p className="text-3xl font-bold text-amber-500">{inactiveCount}</p>
          </div>
          <div className="h-20 bg-white rounded-2xl shadow-md p-6 flex items-center gap-6">
            <h2 className="text-lg font-semibold text-gray-700">Audit Logs</h2>
            <p className="text-3xl font-bold text-amber-500">{auditCount}</p>
          </div>
        </section>


        {/* Audit Logs Table */}
        <section className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-black font-bold text-2xl mb-3">Audit Logs</h2>
          <div className="overflow-y-auto max-h-[180px]">
            <table className="text-xs w-full table-fixed text-center border border-gray-300">
              <thead className="bg-gray-200 text-xs uppercase text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="w-60 h-6 px-4 text-black font-semibold">Feature</th>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3">Made By</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
              {logs.length > 0 ? logs.map((log) => (
                <tr
                  key={log.Log_Id}
                  onClick={() => {
                    setSelectedLog(log);
                    setIsLogModalOpen(true);
                  }}
                  className="even:bg-[#F7FAF5] h-[48px] cursor-pointer hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-2 text-left truncate">
                    {log.feature?.Feature_Name || "N/A"}
                  </td>

                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.Log_Activity === "Created" ? "bg-green-100 text-green-600"
                      : log.Log_Activity === "Edited Details" ? "bg-yellow-100 text-yellow-600"
                      : log.Log_Activity === "Updated Status" ? "bg-orange-100 text-orange-600"
                      : "bg-red-100 text-red-600"
                    }`}>
                      {log.Log_Activity}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    {log.user ? `${log.user.User_FName} ${log.user.User_LName}` : "N/A"}
                  </td>

                  <td className="px-4 py-2">
                    {new Date(log.Timestamp).toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-gray-500 text-center">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>

            </table>
          </div>
        </section>

        {/* Features Table */}
        <div className="text-black font-bold text-2xl">Features Added</div>
        <section className="bg-white rounded-2xl shadow-md p-6">
          <div className="overflow-y-auto max-h-[200px]">
            <table className="w-full table-fixed text-xs text-center border border-gray-300">
              <thead className="bg-gray-200 text-xs uppercase text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="w-[200px] h-[50px]">Feature</th>
                  <th className="w-[200px] h-[50px]">Description</th>
                  <th className="w-[150px] h-[50px]">Created at</th>
                  <th className="w-[150px] h-[50px]">Enable</th>
                  <th className="w-[150px] h-[50px]">Created by</th>
                  <th className="w-[100px] h-[50px]">Status</th>
                  <th className="w-[100px] h-[50px]">Ticket No.</th>
                  <th className="w-[150px] h-[50px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {features.map((feature) => (
                  <tr key={feature.Feature_Id} className="even:bg-[#F7FAF5]">
                    {/* <td className="h-[48px] px-4 py-2 truncate text-blue-600 hover:underline cursor-pointer"> */}
                    <td
                    title="View Details"
                    className="truncate px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => openFeatureDetails(feature)}
                  >  
                      {feature.Feature_Name}
                    </td>
                    <td className="h-[48px] px-4 py-2 truncate">{feature.Feature_Desc}</td>
                    <td className="h-[48px] px-4 py-2">{new Date(feature.Date_Created).toLocaleDateString()}</td>
                    <td className="h-[48px] px-4 py-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feature.Feature_Status}
                          onChange={() => requestToggleConfirmation(feature.Feature_Id, feature.Feature_Status)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative">
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5" />
                        </div>
                      </label>
                    </td>
                    <td className="h-[48px] px-4 py-2 truncate">
                      {feature.flagAssignments?.[0]?.user
                        ? `${feature.flagAssignments[0].user.User_FName} ${feature.flagAssignments[0].user.User_LName}`
                        : "N/A"}
                    </td>
                    <td className="h-[48px] px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        feature.Feature_Status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}>
                        {feature.Feature_Status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-2">{feature.Feature_JiraNo}</td>


                    {/* <td className="h-[48px] px-4 py-2 space-x-2">
                      <button title="Copy"><img src={CopyIcon} alt="Copy" className="w-3 h-3 inline" /></button>
                      <button title="Edit"><img src={EditIcon} alt="Edit" className="w-3 h-3 inline" /></button>
                      <button title="Delete"><img src={DeleteIcon} alt="Delete" className="w-3 h-3 inline" /></button>
                    </td> */}







                    <td className="w-[150px] h-[50px]">
                    <button title="Copy">
                      <img src={CopyIcon} alt="Copy" className="w-4 h-4 inline" />
                    </button>
                    <button title="Edit" onClick={() => openFeatureDetails(feature)}>
                      <img src={EditIcon} alt="Edit" className="w-4 h-4 inline" />
                    </button>
                    <button title="Delete" 
                      onClick={() => {
                        setDeleteTargetId(feature.Feature_Id);  // store target ID
                        setIsConfirmOpen(true);                 // show modal
                      }}
                      >
                      <img src={DeleteIcon} alt="Delete" className="w-4 h-4 inline" />
                    </button>
                  </td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modals */}
      <FeatureDetailsModal
        feature={selectedFeature}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleEditFeature}
        onDelete={(id) => handleDeleteFeature(id, userId)}
        onToggleFlag={handleToggleFlagAssignment}
      />
      <CreateUserModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      <ConfirmationModal
        isOpen={confirmToggle}
        onClose={() => setConfirmToggle(false)}
        onConfirm={confirmToggleFeature}
        actionType={pendingToggleStatus ? "enable" : "disable"}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Feature updated successfully!"
      />
      <SuccessModal
        isOpen={isDeleteSuccessOpen}
        onClose={() => setIsDeleteSuccessOpen(false)}
        message="Feature deleted successfully!"
      />

<AuditLogModal
  isOpen={isLogModalOpen}
  onClose={() => setIsLogModalOpen(false)}
  log={selectedLog}
/>


<DeleteConfirmationModal
  isOpen={isConfirmOpen}
  onClose={() => {
    setIsConfirmOpen(false);
    setDeleteTargetId(null);
  }}
  onConfirm={() => {
    if (deleteTargetId && userId) {
      handleDeleteFeature(deleteTargetId, userId);
      setIsConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }}
  message="Are you sure you want to delete this feature?"
/>
    </div>
  </div>
);

};

export default Admin_Dashboard;