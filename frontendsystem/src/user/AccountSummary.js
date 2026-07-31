import {
    FaCalendarAlt,
    FaClock,
    FaImage,
    FaUserShield
} from "react-icons/fa";

import "../UserCss/accountSummary.css";

function AccountSummary({ user }) {

    return (

        <div className="account-summary">

            <h2>Account Summary</h2>

            <div className="summary-grid">

                <div className="summary-item">

                    <FaCalendarAlt className="summary-icon"/>

                    <div>

                        <span>Account Created</span>

                        <strong>
                            {new Date(user.createdAt).toLocaleDateString()}
                        </strong>

                    </div>

                </div>

                <div className="summary-item">

                    <FaClock className="summary-icon"/>

                    <div>

                        <span>Last Updated</span>

                        <strong>
                            {new Date(user.updatedAt).toLocaleString()}
                        </strong>

                    </div>

                </div>

                <div className="summary-item">

                    <FaImage className="summary-icon"/>

                    <div>

                        <span>Profile Picture</span>

                        <strong>
                            {user.profilePicture
                                ? "Uploaded ✅"
                                : "Not Uploaded"}
                        </strong>

                    </div>

                </div>

                <div className="summary-item">

                    <FaUserShield className="summary-icon"/>

                    <div>

                        <span>Account Type</span>

                        <strong>
                            {user.role.replace("ROLE_", "")}
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AccountSummary;