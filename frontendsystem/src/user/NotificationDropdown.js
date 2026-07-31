import NotificationItem from "./NotificationItem";
import "../UserCss/notificationDropdown.css";
import { markAllNotificationsRead } from "../services/userservice";

const NotificationDropdown = ({
    notifications,
    setNotifications
}) => {

    const handleMarkAllRead = async () => {

    try {

        await markAllNotificationsRead();

        setNotifications(prev =>
            prev.map(notification => ({
                ...notification,
                read: true
            }))
        );

    } catch (error) {

        console.log(error);

    }

};

    return (

        <div className="notification-dropdown">

            <div className="notification-header">

                <h3>Notifications</h3>
                

                <button className="mark-all-btn" onClick={handleMarkAllRead}>
                    Mark All Read
                </button>

            </div>

            <div className="notification-list">

                {notifications.length === 0 ? (

                    <div className="empty-notification">

                        No notifications yet.

                    </div>

                ) : (

                    notifications.map(notification => (

                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            setNotifications={setNotifications}
                        />

                    ))

                )}

            </div>

            <div className="notification-footer">

                View All Notifications

            </div>

        </div>

    );

};

export default NotificationDropdown;