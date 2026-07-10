import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PermissionsProvider, usePermissions } from "./context/PermissionsContext";
import { FEATURE_PERM_MAP } from "./featurePermissionMap";
import Sidebar from "./components/sidebar";
import { CRMRoutes as CRM } from "./pages/CRM";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import { hasFeature, FEATURES } from "./planAccess";
import "./App.css";

function isAuthenticated() {
  return !!localStorage.getItem("manod_token");
}

function AccessDenied() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", gap: 16,
    }}>
      <div style={{ fontSize: 64 }}>ðŸ”’</div>
      <h2>Access Denied</h2>
      <p>You don't have permission to view this page.</p>
    </div>
  );
}

function PrivateRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}
function FeatureRoute({ feature, children }) {
  return children;
}
function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", overflow: "hidden", background: "#f0f4f1" }}>
      <Sidebar />
      <main style={{
        marginLeft: "260px",
        width: "calc(100vw - 260px)",
        minWidth: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#f0f4f1",
      }}>
        <Routes>
          <Route path="/"      element={<FeatureRoute feature={FEATURES.CRM}><CRM /></FeatureRoute>} />
          <Route path="/crm/users" element={<FeatureRoute feature={FEATURES.USER_MANAGEMENT}><Users /></FeatureRoute>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/crm/*" element={<FeatureRoute feature={FEATURES.CRM}><CRM /></FeatureRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <PermissionsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PrivateRoute><AppLayout /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </PermissionsProvider>
  );
}

export default App;



