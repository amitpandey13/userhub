
const ADMIN_URL = `${process.env.REACT_APP_API_BASE_URL}/api/admin`;
export const getAuditLogs = async (page = 0, size = 10) => {

    try {

        const response = await fetch(

            `${ADMIN_URL}/audit-logs?page=${page}&size=${size}`,

            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }

        );

        if (!response.ok) {

            throw new Error("Failed to fetch audit logs.");

        }

        return await response.json();

    } catch (error) {

        console.error("Error fetching audit logs:", error);

        throw error;

    }

};

export const searchAuditLogs = async (

    search = "",

    action = "",

    page = 0,

    size = 10

) => {

    const token = localStorage.getItem("token");

    let url = `${ADMIN_URL}/audit-logs/search?page=${page}&size=${size}`;

    if (search) {

        url += `&search=${encodeURIComponent(search)}`;

    }

    if (action) {

        url += `&action=${action}`;

    }

    const response = await fetch(url, {

        method: "GET",

        headers: {

            "Authorization": `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    });

    if (!response.ok) {

        throw new Error("Failed to fetch audit logs.");

    }

    return await response.json();

};