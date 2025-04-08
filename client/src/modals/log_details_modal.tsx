import { Audit } from "../types";

interface LogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: Audit | null;
}

const LogDetailsModal = ({ isOpen, onClose, log }: LogDetailsModalProps) => {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Log Details</h2>
        <p><strong>Feature:</strong> {log.feature?.Feature_Name || "N/A"}</p>
        <p><strong>Activity:</strong> {log.Log_Activity}</p>
        <p><strong>Made By:</strong> {log.user ? `${log.user.User_FName} ${log.user.User_LName}` : "N/A"}</p>
        <p><strong>Timestamp:</strong> {new Date(log.Timestamp).toLocaleString()}</p>
        <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LogDetailsModal;
