import { useEffect, useState } from "react";
import { FaUserEdit, FaKey, FaCamera, FaUserCircle } from "react-icons/fa";
import { getCurrentUser, uploadProfilePicture } from "../services/userservice";

import ProfileCard from "../user/ProfileCard";
import QuickActions from "../user/QuickActions";
import "../UserCss/UserDashboard.css";
import "../UserCss/ProfileCard.css";
import "../UserCss/quickAction.css";
import "../UserCss/accountSummary.css";
import WelcomeBanner from "../user/WelcomeBanner";
import DashboardStats from "../user/DashboardStats";
import AccountSummary from "../user/AccountSummary";
import { deleteProfilePicture } from "../services/userservice";
import EditProfileModal from "../user/EditProfileModal";
import ProfileCompletion from "../user/ProfileCompletion";
import NotificationBell from "../user/NotificationBell";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleProfileUpload = async (file) => {
    try {
      const updatedUser = await uploadProfilePicture(file);

      setUser(updatedUser);

      toast.success("Profile picture updated successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to upload profile picture.");
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      const updatedUser = await deleteProfilePicture();

      setUser(updatedUser);

      toast.success("Profile picture removed successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getCurrentUser();

      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
     <div className="user-layout">

        <Sidebar />

    
    <div className="user-dashboard">
     <WelcomeBanner user={user} />

    

<div className="dashboard-content">

    <ProfileCard
        user={user}
        onUpload={handleProfileUpload}
        onDelete={handleDeleteProfilePicture}
    />

    <QuickActions
    onEditProfile={() => setShowEditModal(true)}
/>

</div>

<DashboardStats user={user} />

<AccountSummary user={user} />
<ProfileCompletion user={user} />
 {
            showEditModal && (

                <EditProfileModal

                    user={user}

                    onClose={() => setShowEditModal(false)}

                    onUpdate={(updatedUser) =>
                        setUser(updatedUser)
                    }

                />

            )
        }

</div>
</div>
  );
};

export default UserDashboard;
