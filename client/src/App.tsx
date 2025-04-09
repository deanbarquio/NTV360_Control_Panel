import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/general/login";
import Admin_Dashboard from "./admin/pages/admin_dashboard";
import DevDashboard from "../../client/src/devs/dev_dashboard"
import FeatureList from "./admin/pages/admin_features";
import AdminAuditLogs from "./admin/pages/admin_audit_logs";
import NotFound from "./admin/pages/NotFound"
import Landing from "./general/Landing";

function App() {
    return (
        <Router>
            <Routes>
                <Route index element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admindashboard" element={<Admin_Dashboard />} />
                <Route path="/devdashboard" element={<DevDashboard />} />
                <Route path="/adminfeatures" element={<FeatureList />} />
                <Route path="/adminAuditLogs" element={<AdminAuditLogs />} />
                {/* <Route path="*" element={<NotFound />} /> */}
            
            </Routes>
        </Router>
    );
}

export default App;
