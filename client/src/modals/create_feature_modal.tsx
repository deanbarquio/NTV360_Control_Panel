import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "./success_modal"; 

interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  userId: string | null;
}

const CreateFeatureModal: React.FC<CreateFeatureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId, // ✅ use the prop here
}) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("enabled");
  const [loading, setLoading] = useState(false);
  
  const [jiraNo, setJiraNo] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);


  if (!isOpen) return null;
  const handleCreate = async () => {
    setError("");
    setLoading(true);
  
    try {
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }
  
      const isEnabled = status === "enabled"; // ✅ convert selection to boolean
  
      const payload = {
        Feature_Name: name,
        Feature_Desc: desc,
        Feature_Status: isEnabled, // For Feature_Flag
        User_Id: userId,
        Feature_JiraNo: jiraNo,
        is_enabled: isEnabled       // ✅ For Flag_Assignment
      };
  
      console.log("📦 Final Payload:", payload);
      
      await axios.post("/api/features", payload);

      setShowSuccess(true);
  
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        onSuccess();
      }, 1500); // 1.5 seconds
      
      //alert("✅ Feature created!");
      //onClose();
      //await onSuccess();
    } catch (err: any) {
      console.error("Feature creation failed:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
//   const handleCreate = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       if (!userId) {
//         setError("User ID not found. Please log in again.");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         Feature_Name: name,
//         Feature_Desc: desc,
//         Feature_Status: status === "enabled",
//         User_Id: userId, // ✅ pass from props, not localStorage
//       };

//       await axios.post("http://localhost:5000/api/features", payload);


//       alert("✅ Feature created!");
//       onClose();
//       await onSuccess();
//     } catch (err: any) {
//       console.error("Feature creation failed:", err);
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4 text-black">Create New Feature</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="text-black">Feature Name</label>
        <input
          type="text"
          placeholder="Feature Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-black border border-gray-300 px-3 py-2 rounded w-full mb-3"
          required
        />

        <label className="text-black">Feature Description</label>
        <textarea
          placeholder="Feature Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="text-black border border-gray-300 px-3 py-2 rounded w-full mb-3"
          rows={3}
          required
        />

        <label className="text-black">Set Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-black border border-gray-300 px-3 py-2 rounded w-full mb-3"
        >
          <option value="enabled">Enable</option>
          <option value="disabled">Disable</option>
        </select>

        <label className="text-black">Jira Ticket No.</label>
        <input
          type="text"
          placeholder="Jira Ticket No. (Optional)"
          value={jiraNo}
          onChange={(e) => setJiraNo(e.target.value)}
          className="text-black border border-gray-300 px-3 py-2 rounded w-full mb-3"
          required
        />

        <div className="flex justify-end mt-4">
          <button
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

     

      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="✅ Feature successfully created!"
      />
    </div>
    
  );
};

export default CreateFeatureModal;
