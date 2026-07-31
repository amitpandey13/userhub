const ADMIN_URL = "http://localhost:8080/api/admin";

export const exportCsv = async () => {

    const response = await fetch(
        `${ADMIN_URL}/export/csv`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to export CSV");
    }

    return response.blob();
};