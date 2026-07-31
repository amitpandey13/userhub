import { useState } from "react";
import { toast } from "react-toastify";
import { broadcastNotification } from "../services/userservice";
import "../UserCss/broadcastNotificationModal.css";

const BroadcastNotificationModal = ({ onClose }) => {
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

    const confirmed = window.confirm(
      "This notification will be sent to ALL users.\n\nDo you want to continue?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await broadcastNotification({
        title,
        message,
        type,
      });

      toast.success("Notification sent to all users.");

      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Broadcast Notification</h2>

          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
              placeholder="Write notification..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Notification Type</label>

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
              {loading ? "Sending..." : "Send to All"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BroadcastNotificationModal;
