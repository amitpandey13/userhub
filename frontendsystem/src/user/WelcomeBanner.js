
import React from "react";
import '../UserCss/welcomeBanner.css'
import NotificationBell from "../user/NotificationBell";

const WelcomeBanner = ({ user }) => {

    const hour = new Date().getHours();

    let greeting = "";
    let message = "";

    if (hour >= 5 && hour < 12) {

        greeting = "Good Morning";
        message = "Hope you have a productive day ahead.";

    } else if (hour >= 12 && hour < 17) {

        greeting = "Good Afternoon";
        message = "Here's your account overview for today.";

    } else if (hour >= 17 && hour < 21) {

        greeting = "Good Evening";
        message = "Welcome back! Let's get things done.";

    } else {

        greeting = "Good Night";
        message = "You're working late. Don't forget to take some rest.";

    }

    const currentDate = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (

        <div className="welcome-banner">

            <div className="welcome-text">

                <h1>
                    {greeting},
                    <span className="user-name"> {user.name} 👋</span>
                </h1>

                <p>{message}</p>

            </div>

             <div className="welcome-right">

            <NotificationBell />

            <div className="welcome-date">

                <h3>{currentDate}</h3>

            </div>

        </div>

        </div>

    );

};

export default WelcomeBanner;



