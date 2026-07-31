import { NavLink } from "react-router-dom";
import { logout } from "../services/userservice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "../UserCss/sidebar.css";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  console.log(userRole);

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
   <div className={`sidebar ${darkMode ? "sidebar-dark" : ""}`}>
  <h2>Scrolled Options</h2>

  <NavLink to="/admin/dashboard">
    <FaHome />
    <span>Dashboard</span>
  </NavLink>

  {userRole === "ROLE_ADMIN" ? (
    <>
      <NavLink to="/api/admin/getAllUsers">
        <FaUsers />
        <span>Manage Users</span>
      </NavLink>

      <NavLink to="/admin/audit-logs">
        <FaUsers />
        <span>Audit Logs</span>
      </NavLink>
    </>
  ) : (
    <>
           <button
                onClick={() => navigate("/user/change-password")}
            >
                Change Password
            </button>

            <button>
                Upload Profile Picture
            </button>
    </>
  )}

  <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>

  <button onClick={handleLogout}>
    <FaSignOutAlt />
    <span>Logout</span>
  </button>
</div>
  );
}

export default Sidebar;
