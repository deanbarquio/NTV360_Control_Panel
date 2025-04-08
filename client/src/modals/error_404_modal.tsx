import React from "react";

interface Error404ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const Error404Modal: React.FC<Error404ModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full animate-fade-in">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">⚠️ 404 Not Found</h2>
        <p className="text-gray-700 mb-4">{message || "The requested resource was not found."}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404Modal;
