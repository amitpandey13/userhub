import { useState } from "react";
import { toast } from "react-toastify";
import { sendNotification } from "../services/userservice";
import "../UserCss/sendNotificationModal.css";

const SendNotificationModal = ({ user, onClose }) => {
  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [type, setType] = useState("INFO");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!message.trim()) {
      toast.error("Message is required.");
      return;
    }

    try {
      setLoading(true);

      await sendNotification({
        userId: user.userId,
        title,
        message,
        type,
      });

      toast.success("Notification sent successfully.");

      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="modal-header">
          <h2>Send Notification</h2>

          <button className="close-btn" onClick={onClose}>
            closeee
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User</label>

            <input type="text" value={user.name} disabled />
          </div>

          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Message</label>

            <textarea
              rows="5"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Type</label>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="INFO">INFO</option>

              <option value="SUCCESS">SUCCESS</option>

              <option value="WARNING">WARNING</option>

              <option value="ERROR">ERROR</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationModal;
