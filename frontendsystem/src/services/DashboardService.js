const ADMIN_URL = `${process.env.REACT_APP_API_BASE_URL}/api/admin`;

export const getDashboard = async () => {

    const response = await fetch(`${ADMIN_URL}/dashboard`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
    }

    return await response.json();
};