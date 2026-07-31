import { useEffect, useState } from "react";
import { searchAuditLogs } from "../services/auditLogService";
import AuditStatsCards from "./AuditStatsCards";
import "../UserCss/auditLogs.css";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [action, setAction] = useState("");

  useEffect(() => {
    loadLogs();
  }, [page, search, action]);

  const loadLogs = async () => {
    try {
      setLoading(true);

      const data = await searchAuditLogs(
        search,

        action,

        page,

        10,
      );

      setLogs(data.content);

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="audit-container">
      <div className="audit-header">
        <div>
          <h2>Audit Logs</h2>

          <p>Monitor every activity performed in the system.</p>
        </div>

        <div className="audit-actions">
          <input
            type="text"
            placeholder="🔍 Search by user or action..."
            value={search}
            onChange={(e) => {
              setPage(0);

              setSearch(e.target.value);
            }}
          />

          <select
            value={action}
            onChange={(e) => {
              setPage(0);

              setAction(e.target.value);
            }}
          >
            <option value="">All Actions</option>

            <option value="USER_CREATED">User Created</option>

            <option value="USER_UPDATED">User Updated</option>

            <option value="USER_DELETED">User Deleted</option>

            <option value="USER_STATUS_CHANGED">Status Changed</option>

            <option value="LOGIN">Login</option>

            <option value="LOGOUT">Logout</option>
          </select>
        </div>
      </div>

      <AuditStatsCards logs={logs} />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <table className="audit-table">
            <thead>
              <tr>
                <th>Performed By</th>

                <th>Target User</th>

                <th>Action</th>

                <th>Description</th>

                <th>IP Address</th>

                <th>Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="user-info">
                        <div className="avatar">
                          {log.performedBy?.charAt(0)}
                        </div>

                        <span>{log.performedBy}</span>
                      </div>
                    </td>

                    <td>
                      <div className="user-info">
                        <div className="avatar target">
                          {log.targetUser?.charAt(0)}
                        </div>

                        <span>{log.targetUser}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`action-badge ${log.action?.toLowerCase()}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>{log.description}</td>

                    <td>{log.ipAddress}</td>

                    <td>
                      {new Date(log.createdAt).toLocaleString(
                        "en-IN",

                        {
                          day: "2-digit",

                          month: "short",

                          year: "numeric",

                          hour: "2-digit",

                          minute: "2-digit",
                        },
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Audit Logs Found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            <span>
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditLogs;
