import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import axios from "axios";
import CreateFeatureModal from "../../modals/create_feature_modal";
import FeatureDetailsModal from "../../modals/feature_details_modal";
import { Feature } from "../../types"; // adjust path
import ConfirmationModal from "../../modals/toggle_confimation_modal"
import SuccessModal from "../../modals/success_modal"
import DeleteConfirmationModal from "../../modals/delete_confirmation_modal"
import { toast } from "react-toastify"; 

// Icons
import CopyIcon from "../../assets/copy_feature_icon.jpg"
import EditIcon from "../../assets/edit_feature_icon.png"
import DeleteIcon from "../../assets/delete_feature_icon.png"

const FeatureList: React.FC = () => {
    const navigate = useNavigate();
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [confirmToggle, setConfirmToggle] = useState(false);
    const [pendingToggleFeatureId, setPendingToggleFeatureId] = useState<string | null>(null);
    // const [toggleActionType, setToggleActionType] = useState<"enable" | "disable">("enable");
    // const [currentToggleStatus, setCurrentToggleStatus] = useState<boolean>(false);
    const [pendingToggleStatus, setPendingToggleStatus] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8; // 👈 limit to 8 rows per page

const totalItems = features.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage + 1;
const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

      // ✅ Retrieve userId from localStorage
const userId = localStorage.getItem("userId");
    
const openFeatureDetails = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDetailsOpen(true);
};

const paginatedFeatures = features.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


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

// const handleToggle = async (featureId: string, currentStatus: boolean) => {
//         try {
//           await axios.put(`/api/features/${featureId}/toggle`, {
//             Feature_Status: !currentStatus,
//           });
    
//           setFeatures((prev) =>
//             prev.map((f) =>
//               f.Feature_Id === featureId ? { ...f, Feature_Status: !currentStatus } : f
//             )
//           );
//         } catch (error) {
//           console.error("Toggle failed:", error);
//         }
// };

useEffect(() => {
  fetchFeatures();
}, []);

// const handleEditFeature = (feature: Feature) => {
//   console.log("Edit Feature", feature);
// };
      
//  const handleDeleteFeature = async (featureId: string) => {
//     const confirm = window.confirm("Are you sure you want to delete this feature?");
//       if (!confirm) return;
      
//       try {
//         await axios.delete(`/api/features/${featureId}`);
//         fetchFeatures();
//         setIsDetailsOpen(false);
//       } catch (err) {
//           console.error("Delete failed", err);
//       }
// };

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

// const handleToggleRequest = (featureId: string, currentStatus: boolean) => {
//   setPendingToggleFeatureId(featureId);
//   setCurrentToggleStatus(currentStatus);
//   setToggleActionType(currentStatus ? "disable" : "enable");
//   setConfirmToggle(true);
// };

const confirmToggleFeature = async () => {
  if (!pendingToggleFeatureId) return;

  try {
    await axios.put(`/api/features/${pendingToggleFeatureId}/toggle`, {
      User_Id: userId,
      Feature_Status: pendingToggleStatus,
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
  }
};

const requestToggleConfirmation = (featureId: string, currentStatus: boolean) => {
  setPendingToggleFeatureId(featureId);
  setPendingToggleStatus(!currentStatus); // this will be the *new* value
  setConfirmToggle(true);
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
  <div className="flex h-screen w-screen bg-[#E3EBDC] overflow-hidden">
    
    {/* Sidebar */}
    <aside className="w-64 bg-gray-900 flex flex-col p-6 text-white shrink-0">
      <h2 className="text-2xl font-bold mb-8 tracking-widest">NTV360</h2>
      <nav className="flex flex-col space-y-4">
        <button onClick={() => navigate("/admindashboard")} className="hover:text-amber-400 text-left">Dashboard</button>
        <button onClick={() => navigate("/adminAuditLogs")} className="hover:text-amber-400 text-left">Audit Logs</button>
        <button onClick={() => navigate("/adminfeatures")} className="hover:text-amber-400 text-left">Features</button>
      </nav>
    </aside>

    {/* Scrollable Main Content */}
    <main className="flex-1 overflow-y-auto p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Feature Flags</h2>
        <button
          className="bg-[#8CB454] hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Feature
        </button>
      </div>

      {/* FILTERING SECTION */}
      <section className="text-xs my-8 grid bg-white rounded-2xl shadow-md p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="font-semibold text-gray-700">Filter by date</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="font-semibold text-gray-700">Filter by phase</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="font-semibold text-gray-700">What are you looking for?</p>
        </div>
      </section>

      {/* Table */}
      <div className="rounded-2xl bg-[#F7FAF5] overflow-x-auto shadow-md p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          // <table className="text-xs w-full table-fixed text-center outline-2">
          
  <table className="text-xs w-full table-fixed text-center outline-gray-300">
            <thead className="bg-[#F7FAF5] text-xs uppercase text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-[200px] h-[50px]">Feature</th>
                <th className="px-4 py-3 w-[200px] h-[50px]">Description</th>
                <th className="w-[150px] h-[50px] px-4 py-3">Created at</th>
                <th className="w-[150px] h-[50px] px-4 py-3">Enable</th>
                <th className="w-[150px] h-[50px] px-4 py-3">Created by</th>
                <th className="px-4 py-3 w-[100px] h-[50px]">Status</th>
                <th className="px-4 py-3 w-[100px] h-[50px]">Ticket No.</th>
                <th className="w-[150px] h-[50px] px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {paginatedFeatures.map((feature) => (
                <tr key={feature.Feature_Id} className="odd:bg-white h-[50px]">
                  <td
                    title="View Details"
                    className="truncate px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => openFeatureDetails(feature)}
                  >
                    {feature.Feature_Name}
                  </td>
                  <td className="truncate px-4 py-2">{feature.Feature_Desc}</td>
                  
                  <td className="px-4 py-2">{new Date(feature.Date_Created).toLocaleString()}</td>
                  
                  {/* FEATURE STATUS */}
                  <td className="px-4 py-2">
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

                  {/* CREATED BY */}
                  <td className="truncate px-4 py-2">
                    {feature.flagAssignments?.[0]?.user
                      ? `${feature.flagAssignments[0].user.User_FName} ${feature.flagAssignments[0].user.User_LName}`
                      : "N/A"}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        // bg-green-100 bg-red-100
                        feature.Feature_Status ? " text-green-600" : " text-red-600"
                      }`}
                    >
                      {feature.Feature_Status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* JIRA NO */}
                  <td className="px-4 py-2">{feature.Feature_JiraNo}</td>

                
                   <td className="w-[150px] h-[50px]">
                    <button title="Copy">
                      <img src={CopyIcon} alt="Copy" className="w-4 h-4 inline" />
                    </button>
                    <button title="Edit" onClick={() => openFeatureDetails(feature)}>
                      <img src={EditIcon} alt="Edit" className="w-4 h-4 inline" />
                    </button>
                    <button
                      title="Delete"
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

            {/* PAGINATION INSIDE TABLE */}
            {/* <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"> */}
          </table> 
        )}
      </div>

      {/* PAGINATION */}
      <footer>
      <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
  <div className="flex flex-1 justify-between sm:hidden">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      Previous
    </button>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      Next
    </button>
  </div>

  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
    <p className="text-sm text-gray-700">
  Showing{" "}
  <span className="font-medium">
    {endIndex - startIndex + 1}
  </span>{" "}
  {endIndex - startIndex + 1 === 1 ? "feature" : "features"} out of{" "}
  <span className="font-medium">{totalItems}</span> results
</p>

    </div>

    <div>
      <nav
        aria-label="Pagination"
        className="isolate inline-flex -space-x-px rounded-md shadow-xs"
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon aria-hidden="true" className="size-5" />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0 ${
                currentPage === page
                  ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-indigo-600"
                  : "text-gray-900 ring-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon aria-hidden="true" className="size-5" />
        </button>
      </nav>
    </div>
  </div>
</div>

      </footer>

      {/* Modals */}
      {isModalOpen && (
        <CreateFeatureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchFeatures}
          userId={userId}
        />
      )}

      <FeatureDetailsModal
        feature={selectedFeature}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleEditFeature}
        onDelete={(id) => handleDeleteFeature(id, userId)}
        onToggleFlag={handleToggleFlagAssignment}
      />

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


    </main>
  </div>
);
};

export default FeatureList;