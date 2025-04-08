import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  message = "Action completed successfully!",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center relative animate-fade-in">
        <CheckCircle2 className="mx-auto text-green-500" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mt-3">Success</h2>
        <p className="text-sm text-gray-600 mt-2">{message}</p>

        <button
          onClick={onClose}
          className="mt-5 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
