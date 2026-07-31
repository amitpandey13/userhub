import React from "react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  searchUsers,
  restoreUser,
  importExcel,
} from "../services/userservice";
import { exportCsv } from "../services/CsvExportService";
import { exportExcel } from "../services/ExportExcel";
import { exportPdf } from "../services/PdfExportService";
import "../UserCss/getallusers.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { downloadErrorReport } from "../components/ErrorReport";
import SendNotificationModal from "../admin/SendNotificationModal";

//getAllUsers

const UserList = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const fileInputRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showNotificationModal, setShowNotificationModal] = useState(false);

const navigate = useNavigate();

  const openEditForm = (user) => {
    setEditingUser({
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: "",
    });
  };

  const handleEditChange = (event) => {
    setEditingUser({
      ...editingUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      await updateUser(editingUser.userId, editingUser);

      // setEditingUser(null);
      toast.success("User updated successfully!");
      setMessage("User updated successfully!");
      loadUsers();
    } catch (error) {
      console.log(error);
      toast.error("Unable to update user.");
      setMessage("Unable to update user.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, pageSize, statusFilter]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers(page, pageSize, statusFilter);

      setAllUsers(data.content);
      setTotalPages(data.totalPages);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Unable to load users.");
    }
  };

  /* useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {                                        //normal getAllelements
      const data = await getAllUsers();
      setAllUsers(data);
    } catch (error) {
      console.log(error);
      setMessage("Unable to load users.");
    }
  };
  */

  //delete user///
  const handleDeleteById = async (userId) => {
    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this user?",
    // );
    const result = await Swal.fire({
      title: "Delete User?",

      text: "You won't be able to undo this action.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting User...",
          text: "Please wait...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          timer: 2000,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await deleteUser(userId);

        toast.success("User deleted successfully!");

        // If the deleted user was the last row on a page, go back one page.
        if (allUsers.length === 1 && page > 0) {
          setPage(page - 1);
        } else {
          loadUsers();
        }
      } catch (error) {
        console.log(error);
        toast.error("Unable to delete user");
        setMessage("Unable to delete user.");
      }
    } else {
      return;
    }
  };

  const handleRestoreById = async (userId) => {
    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this user?",
    // );
    const result = await Swal.fire({
      title: "Restore User?",

      text: "User will be Restored",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: "Yes, Restore",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Restoring User...",
          text: "Please wait...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          timer: 2000,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await restoreUser(userId);

        toast.success("User restored successfully!");

        // If the deleted user was the last row on a page, go back one page.
        if (allUsers.length === 1 && page > 0) {
          setPage(page - 1);
        } else {
          loadUsers();
        }
      } catch (error) {
        console.log(error);
        toast.error("Unable to restore user");
        setMessage("Unable to restore user.");
      }
    } else {
      return;
    }
  };

  //update user code
  //   const handleUpdateUser = () => {
  //     alert("i got clicked 1");

  //     try {
  //       const handleUpdateUser = async (userId, user) => {
  //         const updatedUser = await updateUser(userId, user);
  //         setMessage("user updated successfully!");
  //         alert("i got clicked 2");
  //       };
  //     } catch (err) {
  //       console.log(err);
  //       setMessage("update unsuccessfull");
  //     }
  //   };

  //  try {
  //       const response = await saveUser(user)

  //       setMessage("Customer created successfully!");
  //       navigate('/users/getAllUsers')
  //       setUser({ name: "", email: "", password: "" });
  //     } catch (error) {
  //         console.log(error)
  //       setMessage("Something went wrong. Please try again.");
  //     }
  //   };

  /*searching processs

        */

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchSearchResults = async () => {
        try {
          if (search.trim() === "") {
            await getAllUsers(page, pageSize, statusFilter);
          } else {
            const data = await searchUsers(search);
            setAllUsers(data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchSearchResults();
    }, 500); // Wait 500 ms after the user stops typing

    return () => clearTimeout(timer);
  }, [search]);

  //single function to handle csv,excel,pdf

  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };

  ///csv files

  const handleExportCsv = async () => {
    try {
      toast.info("Your Csv File is getting Downloaded..");
      const blob = await exportCsv();

      //  toast.success("Csv downloaded");

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "users.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  //handle Export Excel

  const handleExportExcel = async () => {
    toast.info("Your Excel File is getting Downloaded..");
    const blob = await exportExcel();

    //toast.success("Excel Sheet Downloaded")

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "users.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };

  const handleExportPdf = async () => {
    const toastId = toast.loading("Generating PDF...");

    try {
      const blob = await exportPdf();

      downloadFile(blob, "users.pdf");

      toast.update(toastId, {
        render: "PDF downloaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch {
      toast.update(toastId, {
        render: "Failed to export PDF",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  // const handleExportPdf = async () => {

  //     const toastId = toast.loading("Generating PDF...");

  //     try {

  //         const blob = await exportPdf();

  //         const url = window.URL.createObjectURL(blob);

  //         const link = document.createElement("a");

  //         link.href = url;
  //         link.download = "users.pdf";

  //         document.body.appendChild(link);

  //         link.click();

  //         link.remove();

  //         window.URL.revokeObjectURL(url);

  //         toast.update(toastId, {
  //             render: "PDF downloaded successfully",
  //             type: "success",
  //             isLoading: false,
  //             autoClose: 3000
  //         });

  //     } catch (error) {

  //         toast.update(toastId, {
  //             render: "Failed to export PDF",
  //             type: "error",
  //             isLoading: false,
  //             autoClose: 3000
  //         });

  //     }

  // };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const result = await importExcel(file);
      console.log(result);
      console.log(result.errors);

      if (result.skippedRows > 0) {
        const response = await Swal.fire({
          icon: "warning",

          title: "Import Completed",

          html: `
                    <b>Total Rows :</b> ${result.totalRows}<br>
                    <b>Imported :</b> ${result.importedRows}<br>
                    <b>Skipped :</b> ${result.skippedRows}
                `,

          showCancelButton: true,

          confirmButtonText: "Download Error Report",

          cancelButtonText: "Close",
        });

        if (response.isConfirmed) {
          console.log(result.errors);
          const report = downloadErrorReport(result.errors);
          toast.success("Downloading Csv For ErrorImports");
        }
      } else {
        await Swal.fire({
          icon: "success",

          title: "Import Successful",

          html: `
                    <b>Total Rows :</b> ${result.totalRows}<br>
                    <b>Imported :</b> ${result.importedRows}
                `,
        });
      }

      loadUsers();
      // loadDashboard();
    } catch (error) {
      Swal.fire({
        icon: "error",

        title: "Import Failed",

        text: error.message,
      });
    }

    e.target.value = "";
  };

  const openNotificationModal = (user) => {
    setSelectedUser(user);

    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);

    setSelectedUser(null);
  };

  return (
    <div className="user-list-container">
      {/* import excel */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <button
        className="add-user-btn"
        onClick={() => navigate("/admin/add-user")}
      >
        + Add User
      </button>
      <button onClick={() => fileInputRef.current.click()}>
        📥 Import Excel
      </button>

      <button onClick={handleExportPdf}>Export PDF</button>
      <button onClick={handleExportExcel}>Export EXCEL</button>
      <button onClick={handleExportCsv}>Export CSV</button>
      <div className="toolbar">
        <input
          type="text"
          placeholder="🔍 Search users..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All Users</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
      <br />
      <h1>Saved Users</h1>
      {message && <p className="error-message">{message}</p>}
      {allUsers.length === 0 ? (
        <p className="empty-message">No users found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {allUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {" "}
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
                  <td>
                    <div className="action-buttons">
                      {user.status === "ACTIVE" ? (
                        <>
                          <button
                            className="delete-button"
                            onClick={() => openEditForm(user)}
                          >
                            Update
                          </button>
                          <button
                            className="notify-btn"
                            onClick={() => openNotificationModal(user)}
                          >
                            Notify
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDeleteById(user.userId)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          className="restore-button"
                          onClick={() => handleRestoreById(user.userId)}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* ******************************************** */}
          {showNotificationModal && (
            <SendNotificationModal
              user={selectedUser}
              onClose={closeNotificationModal}
            />
          )}
          {editingUser && (
            <div className="modal-overlay">
              <div className="edit-modal">
                <h2>Update User</h2>

                <form onSubmit={handleUpdate}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingUser.name}
                    onChange={handleEditChange}
                    required
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleEditChange}
                    required
                  />

                  <label>New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={editingUser.password}
                    onChange={handleEditChange}
                    placeholder="Leave blank to keep current password"
                  />

                  <div className="modal-actions">
                    <button type="button" onClick={() => setEditingUser(null)}>
                      Cancel
                    </button>

                    <button type="submit" className="save-button">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ******************** */}
        </div>
      )}
      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Prev
        </button>

        <span>
          {page + 1} / {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages - 1 || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
