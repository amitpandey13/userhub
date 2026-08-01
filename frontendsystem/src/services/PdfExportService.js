const ADMIN_URL = `${process.env.REACT_APP_API_BASE_URL}/api/admin`;

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