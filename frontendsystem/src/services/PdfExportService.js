const ADMIN_URL = "http://localhost:8080/api/admin";

export const exportPdf = async () => {

    const response = await fetch(
        `${ADMIN_URL}/export/pdf`,
        {
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to export PDF");
    }

    return await response.blob();

};