import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { verifyOtp } from '../services/authService'
import "../UserCss/forgotPassword.css";

function VerifyOtp() {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    if (!email) {

        navigate("/forgot-password");

        return null;

    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!otp.trim()) {

            Swal.fire({

                icon: "warning",

                title: "OTP Required",

                text: "Please enter the OTP."

            });

            return;

        }

        try {

            setLoading(true);

            const message = await verifyOtp(email, otp);

            Swal.fire({

                icon: "success",

                title: "Verified",

                text: message,

                timer: 1500,

                showConfirmButton: false

            });

            navigate("/reset-password", {

                state: {

                    email,

                    otp

                }

            });

        }

        catch (error) {

            Swal.fire({

                icon: "error",

                title: "Verification Failed",

                text: error.message

            });

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="forgot-page">

            <div className="forgot-card">

                <h2>Verify OTP</h2>

                <p>

                    OTP has been sent to

                    <br />

                    <strong>{email}</strong>

                </p>

                <form onSubmit={handleSubmit}>

                    <label>OTP</label>

                    <input

                        type="text"

                        placeholder="Enter 6-digit OTP"

                        value={otp}

                        onChange={(e) => setOtp(e.target.value)}

                        maxLength={6}

                    />

                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Verifying..."

                                : "Verify OTP"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default VerifyOtp;