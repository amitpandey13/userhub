import React from "react";
import "../UserCss/profileCompletion.css";

function ProfileCompletion({ user }) {

    const fields = [
        user.name,
        user.email,
        user.phoneNumber,
        user.address,
        user.city,
        user.country,
        user.dateOfBirth,
        user.gender,
        user.bio,
        user.profilePicture
    ];

    const completedFields =
        fields.filter(field => field && field !== "").length;

    const totalFields = fields.length;

    const percentage =
        Math.round((completedFields / totalFields) * 100);

    return (

        <div className="profile-completion">

            <div className="completion-header">

                <h3>Profile Completion</h3>

                <span>{percentage}%</span>

            </div>

            <div className="progress-bar">

                <div
                    className="progress-fill"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

            <div className="completion-list">

                <p>{user.name ? "✅" : "⬜"} Name</p>

                <p>{user.email ? "✅" : "⬜"} Email</p>

                <p>{user.phoneNumber ? "✅" : "⬜"} Phone Number</p>

                <p>{user.address ? "✅" : "⬜"} Address</p>

                <p>{user.city ? "✅" : "⬜"} City</p>

                <p>{user.country ? "✅" : "⬜"} Country</p>

                <p>{user.dateOfBirth ? "✅" : "⬜"} Date of Birth</p>

                <p>{user.gender ? "✅" : "⬜"} Gender</p>

                <p>{user.bio ? "✅" : "⬜"} Bio</p>

                <p>{user.profilePicture ? "✅" : "⬜"} Profile Picture</p>

            </div>

        </div>

    );

}

export default ProfileCompletion;