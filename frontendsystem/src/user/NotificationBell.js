import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../services/userservice";
import '../UserCss/notificationBell.css'

const NotificationBell = () => {

    const [notifications, setNotifications] = useState([]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            setNotifications(data);

        } catch (error) {

            console.log(error);

        }

    };

    const unreadCount =
        notifications.filter(n => !n.read).length;

    return (

        <div className="notification-bell">

            <button
                className="bell-btn"
                onClick={() => setOpen(!open)}
            >

                <FaBell />

                {unreadCount > 0 && (

                    <span className="notification-count">

                        {unreadCount}

                    </span>

                )}

            </button>

            {open && (

                <NotificationDropdown

                    notifications={notifications}

                    setNotifications={setNotifications}

                />

            )}

        </div>

    );

};

export default NotificationBell;