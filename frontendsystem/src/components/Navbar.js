import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/userservice";


function Navbar() {

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    const handleLogout = async () => {

        await logout();

        navigate("/login");
    };

    return (

        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px",
            background: "#222",
            color: "white"
        }}>

            <div>

                <Link
                    to="/"
                    style={{
                        color: "white",
                        marginRight: "20px"
                    }}
                >
                    Home
                </Link>

                {role === "ROLE_ADMIN" && (

                    <Link to="/dashboard" style={{
                        color: "white",
                        marginRight: "20px"
                    }}>
                           Dashboard
                    </Link>

                   
                

                )}

                <Link
                    to="/profile"
                    style={{
                        color: "white"
                    }}
                >
                    Profile
                </Link>

            </div>

            <div>

                <span>
                    {email}
                </span>

                <button
                    style={{
                        marginLeft: "20px"
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );
}

export default Navbar;