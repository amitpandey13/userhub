import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";


import { changePassword } from '../services/userservice'

import '../UserCss/changePassword.css';


const ChangePassword = () => {

    const navigate = useNavigate();

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await changePassword(passwordData);

            toast.success(response.message);

            navigate("/user/dashboard");

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="change-password-container">

            <form
                className="change-password-form"
                onSubmit={handleSubmit}
            >

                <h2>Change Password</h2>

                <label>Current Password</label>

                <div className="password-field">

                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        placeholder="Enter Current Password"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
                        required
                    />

                    <span
                        onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                        }
                    >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                <label>New Password</label>

                <div className="password-field">

                    <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter New Password"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        required
                    />

                    <span
                        onClick={() =>
                            setShowNewPassword(!showNewPassword)
                        }
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                <label>Confirm Password</label>

                <div className="password-field">

                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <span
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Change Password"}
                </button>

            </form>

        </div>

    );

};

export default ChangePassword;