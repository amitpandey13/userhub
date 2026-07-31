import React from "react";
import "../UserCss/ProfileCard.css";
// import { uploadProfilePicture } from "../services/userService";
import { toast } from "react-toastify";

import ProfilePictureUpload from "../user/ProfilePictureUpload";

const ProfileCard = ({ user, onUpload, onDelete }) => {
  return (
    <div className="profile-card">
      <ProfilePictureUpload
        imageUrl={user.profilePicture}
        onUpload={onUpload}
        onDelete={onDelete}
      />
      <h2>{user.name}</h2>

      <p className="email">{user.email}</p>

      <div className="badge-container">
        <span className="role-badge">{user.role.replace("ROLE_", "")}</span>

        <span
          className={
            user.status === "ACTIVE" ? "status active" : "status inactive"
          }
        >
          {user.status === "ACTIVE" ? "🟢 Active" : "🔴 Inactive"}
        </span>
      </div>

      <div className="profile-info">
        <div className="info-row">
          <span>User ID</span>

          <strong>{user.userId}</strong>
        </div>

        <div className="info-row">
          <span>Joined</span>

          <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
