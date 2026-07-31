import {
  FaClipboardList,
  FaUserPlus,
  FaUserEdit,
  FaTrashAlt,
} from "react-icons/fa";

import "../UserCss/auditStatsCards.css";

const AuditStatsCards = ({ logs }) => {
  const totalLogs = logs.length;

  const created = logs.filter((log) => log.action === "USER_CREATED").length;

  const updated = logs.filter((log) => log.action === "USER_UPDATED").length;

  const deleted = logs.filter((log) => log.action === "USER_DELETED").length;

  return (
    <div className="audit-cards">
      <div className="audit-card total">
        <div className="audit-icon">
          <FaClipboardList />
        </div>

        <div>
          <h2>{totalLogs}</h2>

          <p>Total Logs</p>
        </div>
      </div>

      <div className="audit-card created">
        <div className="audit-icon">
          <FaUserPlus />
        </div>

        <div>
          <h2>{created}</h2>

          <p>User Created</p>
        </div>
      </div>

      <div className="audit-card updated">
        <div className="audit-icon">
          <FaUserEdit />
        </div>

        <div>
          <h2>{updated}</h2>

          <p>User Updated</p>
        </div>
      </div>

      <div className="audit-card deleted">
        <div className="audit-icon">
          <FaTrashAlt />
        </div>

        <div>
          <h2>{deleted}</h2>

          <p>User Deleted</p>
        </div>
      </div>
    </div>
  );
};

export default AuditStatsCards;
