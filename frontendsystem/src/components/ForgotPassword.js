import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../UserCss/forgotPassword.css";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Email Required",
                text: "Please enter your email."
            });

            return;
        }

        try {

            setLoading(true);

            const message = await forgotPassword(email);

            Swal.fire({
                icon: "success",
                title: "OTP Sent",
                text: message,
                timer: 1800,
                showConfirmButton: false
            });

            navigate("/verify-otp", {
                state: {
                    email
                }
            });

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

                <h2>Forgot Password</h2>

                <p>
                    Enter your registered email to receive an OTP.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Sending OTP..."
                                : "Send OTP"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default ForgotPassword;