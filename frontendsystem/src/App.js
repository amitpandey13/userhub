import "./App.css";
import { Routes, Route } from "react-router-dom";

import UserForm from "./components/UserForm";
import UserList from "./admin/UserList";
import Login from "./components/Login";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Dashboard from "./admin/Dashboard";
import { useTheme } from "./context/ThemeContext";
import "./theme.css";
// import { ForgotPassword } from './components/ForgotPassword';
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import ResetPassword from "./components/ResetPassword";
import UserDashboard from "./components/UserDashboard";
// import AdminLayout from './components/AdminLayout';
import UserLayout from './user/UserLayout';
import EditProfile from './user/EditProfile';
import ChangePassword from './user/ChangePassword';
import Profile from './user/Profile';
import AuditLogs from "./admin/AuditLogs";
import AddUser from './admin/AddUser'

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
    <Routes>

    {/* Public Routes */}

    <Route path="/login" element={<Login />} />
    <Route path="/" element={<UserForm />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    


    {/* Admin Routes */}

    <Route
        element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminLayout />
            </ProtectedRoute>
        }
    >

        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="/api/admin/getAllUsers" element={<UserList />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />

        <Route path="/admin/add-user" element={<AddUser />} />

    </Route>


    {/* User Routes */}

    <Route
        element={
            <ProtectedRoute allowedRoles={["ROLE_USER"]}>
                <UserLayout />
            </ProtectedRoute>
        }
    >

        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/user/profile" element={<Profile />} />

        <Route path="/user/edit-profile" element={<EditProfile />} />

        <Route path="/user/change-password" element={<ChangePassword />} />

    </Route>

</Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default App;


