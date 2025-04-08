import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "enable" | "disable"; // dynamically change message
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
}) => {
  if (!isOpen) return null;

  const message =
    actionType === "enable"
      ? "Are you sure you want to enable this feature?"
      : "Are you sure you want to disable this feature?";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Action</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${
              actionType === "enable" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={onConfirm}
          >
            {actionType === "enable" ? "Enable" : "Disable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
