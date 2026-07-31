export const downloadErrorReport = (errors) => {

    const header =
        "Row,Name,Email,Reason\n";

    const rows = errors.map(error =>

        `${error.rowNumber},${error.name},${error.email},${error.reason}`

    );
    console.log(rows);

    const csv =
        header + rows.join("\n");

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "Import_Error_Report.csv";

    a.click();

    window.URL.revokeObjectURL(url);

};