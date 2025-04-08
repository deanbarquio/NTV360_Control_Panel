import React, { useState } from "react";
import { Feature } from "../types";

interface Props {
  feature: Feature | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updatedFeature: Feature) => void;
  onDelete: (featureId: string) => void;
  onToggleFlag: (featureId: string, currentStatus: boolean) => void;
}

const FeatureDetailsModal: React.FC<Props> = ({
  feature,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !feature) return null;

  const creator = feature.flagAssignments?.[0]?.user;

  // 🔧 EDIT MODE STATES
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeature, setEditedFeature] = useState<Feature>({ ...feature });
  
  const handleChange = (field: keyof Feature, value: string | boolean) => {
    setEditedFeature((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditFeature = () => {
    setIsEditing(true);
  };

  const handleSaveFeature = () => {
    onEdit(editedFeature);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl p-8 shadow-2xl flex gap-6">
        {/* LEFT PANEL */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Feature Details</h2>

          {/* Feature Form */}
          <div className="space-y-4 text-sm text-gray-700">
            {/* Feature Name */}
            <div>
              <label className="font-medium block mb-1">Feature Name</label>
              <input
                type="text"
                value={editedFeature.Feature_Name}
                onChange={(e) => handleChange("Feature_Name", e.target.value)}
                readOnly={!isEditing}
                className={`w-full border rounded-md px-4 py-2 ${isEditing ? "bg-white border-gray-400" : "bg-gray-100 border-gray-300"}`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-medium block mb-1">Description</label>
              <textarea
                value={editedFeature.Feature_Desc}
                onChange={(e) => handleChange("Feature_Desc", e.target.value)}
                readOnly={!isEditing}
                className={`w-full rounded-md px-4 py-2 resize-none ${isEditing ? "bg-white border border-gray-400" : "bg-gray-100 border border-gray-300"}`}
                rows={3}
              />
            </div>

            {/* Status (Enabled / Disabled dropdown) */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-medium block mb-1">Status</label>
                {isEditing ? (
                  <select
                    value={editedFeature.Feature_Status ? "enabled" : "disabled"}
                    onChange={(e) =>
                      handleChange("Feature_Status", e.target.value === "enabled")
                    }
                    className="w-full border border-gray-400 rounded-md px-4 py-2 bg-white"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editedFeature.Feature_Status ? "Enabled" : "Disabled"}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                  />
                )}
              </div>
            </div>

            {/* Jira NO */}
            <div>
              <label className="font-medium block mb-1">Ticket No.</label>
              <input
                type="text"
                value={editedFeature.Feature_JiraNo}
                onChange={(e) => handleChange("Feature_JiraNo", e.target.value)}
                readOnly={!isEditing}
                className={`w-full border rounded-md px-4 py-2 ${isEditing ? "bg-white border-gray-400" : "bg-gray-100 border-gray-300"}`}
              />
            </div>

            {/* Created At & Created By (Read-only always) */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-medium block mb-1">Created At</label>
                <input
                  type="text"
                  value={new Date(editedFeature.Date_Created).toLocaleString()}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                />
              </div>

              <div className="flex-1">
                <label className="font-medium block mb-1">Created By</label>
                <input
                  type="text"
                  value={
                    creator
                      ? `${creator.User_FName} ${creator.User_LName}`
                      : "Unknown"
                  }
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(feature.Feature_Id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            {!isEditing ? (
              <button
                onClick={handleEditFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSaveFeature}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Activity History Placeholder */}
        <div className="w-80 bg-gray-50 border border-gray-200 rounded-md p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Activity History
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="italic text-gray-400">No history data yet</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailsModal;
