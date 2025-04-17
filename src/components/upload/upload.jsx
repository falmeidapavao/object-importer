import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useApp } from "./../../contexts/AppContext.jsx";
import api from "./../../api/api.js";
import PreviewTable from "./../preview-table/preview-table.jsx";

const forcedLoadTime = 3000;

function Upload() {
  const { fileData, updateFileData, fileDataExists, updateHasAutoMapped } =
    useApp();
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsLoadingFile(true);

    // Get current timestamp to force a load time of at least 3 seconds
    // This is for demo purposes only
    const startTime = Date.now();

    reader.onload = async (event) => {
      try {
        // Try and load the excel/csv
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Call API with file content and handle errors
        const uploadResponse = await fetch(api.uploadFile.url, {
          ...api.uploadFile.config,
          body: JSON.stringify({ fileName: file.name, data: jsonData }),
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Failed to upload file: ${uploadResponse.status} - ${uploadResponse.statusText}`
          );
        }

        // Map data from API to more suitable format
        const uploadResult = await uploadResponse.json();
        updateFileData(mapExcelData(uploadResult));

        // Reset auto mapping control flag when new file is uploaded
        updateHasAutoMapped(false);
      } catch (error) {
        console.error(
          "An error ocurred when trying to upload you file:",
          error
        );
      } finally {
        // Get the time elapsed during the upload
        const elapsedTime = Date.now() - startTime;

        // End loading after our forced loading time
        setTimeout(() => {
          setIsLoadingFile(false);
        }, Math.max(forcedLoadTime - elapsedTime, 0));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Map excel data that comes from API
  const mapExcelData = ({ headers, data }) => {
    // Map data that comes from uploaded excel file to a more suitable format
    // Include mapping pointers in the columns and restructure rows
    // Column format: {
    //  "columnName": "Model",
    //  "mappedTo": "model"
    // }
    // Row format: {
    //  "OID": 1,
    //  "Sector Name": "North",
    //  "Latitude": 47.41407776,
    //  "Longitude": 8.185952187,
    //  "Manufacturer": "Alstom",
    //  "Model": "AB-2019",
    //  "Voltage": "110V"
    // }

    return {
      columns: headers.map((headerName) => ({
        columnName: headerName,
        mappedTo: null, // Start with no mapping, to be filled later
      })),
      rows: data.map((row) =>
        row.reduce(
          (acc, columnValue, index) => ({
            ...acc,
            [headers[index]]: columnValue,
          }),
          {}
        )
      ),
    };
  };

  return (
    <>
      <div>This is the upload step!</div>
      <div>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
        />
        {isLoadingFile ? (
          <div>Loading...</div>
        ) : fileDataExists() ? (
          <PreviewTable
            columns={fileData.columns}
            rows={fileData.rows}
            showMappings={false}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Upload;
