import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { resetPassword } from "../services/authService";
import "../UserCss/forgotPassword.css";

function ResetPassword() {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email;
    const otp = location.state?.otp;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    if (!email || !otp) {

        navigate("/forgot-password");

        return null;
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!newPassword.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Password Required",
                text: "Please enter your new password."
            });

            return;
        }

        if (newPassword !== confirmPassword) {

            Swal.fire({
                icon: "warning",
                title: "Password Mismatch",
                text: "Both passwords should match."
            });

            return;
        }

        try {

            setLoading(true);

            const message = await resetPassword(
                email,
                otp,
                newPassword
            );

            Swal.fire({
                icon: "success",
                title: "Password Updated",
                text: message,
                timer: 1800,
                showConfirmButton: false
            });

            navigate("/login");

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message
            });

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="forgot-page">

            <div className="forgot-card">

                <h2>Reset Password</h2>

                <p>
                    Create a new password for your account.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>New Password</label>

                    <input
                        type="password"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                    />

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Updating..."
                                : "Reset Password"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default ResetPassword;