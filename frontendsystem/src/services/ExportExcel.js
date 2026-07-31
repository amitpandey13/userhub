const ADMIN_URL = "http://localhost:8080/api/admin";

export const exportExcel = async () => {

    const response = await fetch(
         `${ADMIN_URL}/export/excel`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to export Excel");
    }

    return await response.blob();
};