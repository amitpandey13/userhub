import React, { useEffect, useState } from "react";
import { getDashboard } from "../services/DashboardService";
import "../UserCss/dashboard.css";
// import '../UserCss/getallusers.css'
import { FaUsers } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUserTimes } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import UserDashboard from "../components/UserDashboard";
import MonthlyUsersChart from "../components/MonthlyUsersChart";
import { useTheme } from "../context/ThemeContext";
import UserStatusChart from "../components/UserStatusChart";
import BroadcastNotificationModal from "./BroadcastNotificationModal";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();

        setDashboard(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return <h3>Loading...</h3>;
  }

  const statusData = [
    {
      name: "Active",
      value: dashboard.activeUsers,
    },

    {
      name: "Inactive",
      value: dashboard.inactiveUsers,
    },
  ];

  return (
    <div>
      <div className="dashboard-container">
        <div className="dashboard-card total-card">
          <FaUsers className="card-icon" />
          <h3>Total Users</h3>
          <h1>{dashboard.totalUsers}</h1>
        </div>

        <div className="dashboard-card active-card">
          <FaUserCheck className="card-icon" />
          <h3>Active Users</h3>
          <h1>{dashboard.activeUsers}</h1>
        </div>

        <div className="dashboard-card inactive-card">
          <FaUserTimes className="card-icon" />
          <h3>Inactive Users</h3>
          <h1>{dashboard.inactiveUsers}</h1>
        </div>

        <div className="dashboard-card new-card">
          <FaUserPlus className="card-icon" />
          <h3>New Today</h3>
          <h1>{dashboard.newUsersToday}</h1>
        </div>
      </div>

      <div className="charts-container">
        <UserStatusChart data={statusData} />

        <MonthlyUsersChart data={dashboard.monthlyUsers} />
      </div>
      <button
        className="broadcast-btn"
        onClick={() => setShowBroadcastModal(true)}
      >
        Send Broadcast Notification
      </button>

      <div className="recent-users">
        <h2>Recent Users</h2>

        <table className="recent-users-table">
          <thead>
            <tr>
              <th>Name</th>

              <th>Email</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.recentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={
                      user.status === "ACTIVE"
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {user.status === "ACTIVE" ? "🟢 Active" : "🔴 Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showBroadcastModal && (
        <BroadcastNotificationModal
          onClose={() => setShowBroadcastModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
