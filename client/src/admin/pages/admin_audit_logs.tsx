import React, { useEffect, useState } from "react";
import axios from "axios";
import { Audit } from "../../types"; // ✅ Import Audit interface
import { useNavigate } from "react-router-dom";
import AuditLogModal from "../../modals/log_details_modal"

const Admin_AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<Audit[]>([]);
  const navigate = useNavigate();

     const [selectedLog, setSelectedLog] = useState<Audit | null>(null);
        const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/logs"); // Backend API call
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-[#E3EBDC] flex min-h-screen w-screen">
     {/* Sidebar */}
     <aside className="w-64 text-white bg-gray-900  flex flex-col p-6">
     <h2 className="text-2xl font-bold mb-8 tracking-widest">NTV360</h2>
     <nav className="flex flex-col space-y-4">
       <button className=" bg hover:text-amber-400 text-left" onClick={() => navigate("/admindashboard")}
       >Dashboard</button>
       <button className="hover:text-amber-400 text-left"
       onClick={() => navigate("/adminAuditLogs")}
       >Audit Logs</button>
       <button className="hover:text-amber-400 text-left"
       onClick={() => navigate("/adminfeatures")}
       >Features</button>
     </nav>
   </aside>
   <main className="flex-1 p-10">
      <h1 className="text-black text-3xl font-bold mb-4">Audit Logs</h1>
      <div className="overflow-auto bg-white shadow-md rounded-lg p-4">
        <table className="text-center w-full table-fixed border border-gray-300">
          <thead className="h-[50px] bg-gray-200 text-xs uppercase text-gray-600">
            <tr>
            <th className="px-4 py-3 w-[200px]">Feature</th>
              <th className="px-4 py-3 w-[150px]">Activity</th>
              <th className="px-4 py-3 w-[120px]">User</th>
              <th className="px-4 py-3 w-[200px]">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr
                key={log.Log_Id}
                onClick={() => {
                  setSelectedLog(log);
                  setIsLogModalOpen(true);
                }}
                className="even:bg-[#F7FAF5] h-[48px] cursor-pointer hover:bg-gray-100 transition"
              >
                {/* Feature Name */}
                <td className="px-4 py-2 w-[200px] truncate">
                  {log.feature ? log.feature.Feature_Name : "N/A"}
                </td>

                {/* Log Activity with Colored Badge */}
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    log.Log_Activity === "Created"
                      ? "bg-green-100 text-green-600"
                      : log.Log_Activity === "Edited Details"
                      ? "bg-yellow-100 text-yellow-600"
                      : log.Log_Activity === "Updated Status"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {log.Log_Activity}
                  </span>
                </td>

                {/* User Name */}
                <td className="px-4 py-2 w-[120px] truncate">
                  {log.user ? `${log.user.User_FName} ${log.user.User_LName}` : "N/A"}
                </td>

                {/* Timestamp */}
                <td className="px-4 py-2 w-[200px]">
                  {new Date(log.Timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">No logs available.</td>
            </tr>
          )}

          </tbody>
        </table>
      </div>
      </main>
      <AuditLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        log={selectedLog}
      />

      
  </div>
  );
};

export default Admin_AuditLogs;
