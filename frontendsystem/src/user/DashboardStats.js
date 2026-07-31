import {
    FaIdBadge,
    FaCalendarAlt,
    FaUserShield,
    FaCheckCircle
} from "react-icons/fa";

import "../UserCss/dashboardStats.css";

function DashboardStats({ user }) {

    const stats = [

        {
            title: "User ID",
            value: user.userId,
            icon: <FaIdBadge />,
            color: "#3b82f6"
        },

        {
            title: "Joined",
            value: new Date(user.createdAt).toLocaleDateString(),
            icon: <FaCalendarAlt />,
            color: "#10b981"
        },

        {
            title: "Role",
            value: user.role.replace("ROLE_", ""),
            icon: <FaUserShield />,
            color: "#8b5cf6"
        },

        {
            title: "Status",
            value: user.status,
            icon: <FaCheckCircle />,
            color:
                user.status === "ACTIVE"
                    ? "#22c55e"
                    : "#ef4444"
        }

    ];

    return (

        <div className="dashboard-stats">

            {

                stats.map((item, index) => (

                    <div
                        className="stats-card"
                        key={index}
                    >

                        <div
                            className="stats-icon"
                            style={{
                                background: item.color
                            }}
                        >

                            {item.icon}

                        </div>

                        <div className="stats-content">

                            <span>{item.title}</span>

                            <h3>{item.value}</h3>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default DashboardStats;