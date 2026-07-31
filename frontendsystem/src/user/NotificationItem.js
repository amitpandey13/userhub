import {
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
    FaTrash
} from "react-icons/fa";

import {
    markNotificationAsRead,
    deleteNotification
} from "../services/userservice";

import "../UserCss/notificationItem.css";

const NotificationItem = ({
    notification,
    setNotifications
}) => {

    const getIcon = () => {

        switch (notification.type) {

            case "SUCCESS":
                return <FaCheckCircle className="success-icon" />;

            case "WARNING":
                return <FaExclamationTriangle className="warning-icon" />;

            case "ERROR":
                return <FaTimesCircle className="error-icon" />;

            default:
                return <FaInfoCircle className="info-icon" />;
        }
    };

    const handleRead = async () => {

        if (notification.read) return;

        try {

            await markNotificationAsRead(notification.id);

            setNotifications(prev =>
                prev.map(item =>
                    item.id === notification.id
                        ? { ...item, read: true }
                        : item
                )
            );

        } catch (error) {

            console.log(error);

        }
    };

    const handleDelete = async (e) => {

        e.stopPropagation();

        try {

            await deleteNotification(notification.id);

            setNotifications(prev =>
                prev.filter(item => item.id !== notification.id)
            );

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div
            className={`notification-item ${!notification.read ? "unread" : ""}`}
            onClick={handleRead}
        >

            <div className="notification-icon">

                {getIcon()}

            </div>

            <div className="notification-content">

                <h4>{notification.title}</h4>

                <p>{notification.message}</p>

            </div>

            <button
                className="delete-icon"
                onClick={handleDelete}
            >

                <FaTrash />

            </button>

        </div>

    );

};

export default NotificationItem;