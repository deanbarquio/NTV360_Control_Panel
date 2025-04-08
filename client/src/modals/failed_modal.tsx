// failed_modal.tsx
import React from "react";

interface FailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const FailedModal: React.FC<FailedModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full animate-fade-in">
        <h2 className="text-xl font-semibold text-red-600 mb-2">❌ Failed</h2>
        <p className="text-gray-700 mb-4">{message || "Something went wrong."}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedModal;