import { useNavigate } from "react-router-dom";

const QuickActions = ({ onEditProfile }) => {

    const navigate = useNavigate();

    return (

        <div className="quick-actions">

            <button
               onClick={onEditProfile}
            >
                Edit Profile
            </button>

            <button
                onClick={() => navigate("/user/change-password")}
            >
                Change Password
            </button>

            <button>
                Upload Profile Picture
            </button>

        </div>

    );

};

export default QuickActions;