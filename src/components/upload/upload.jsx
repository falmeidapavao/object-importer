import React, { useState } from "react";
import { useApp } from "./../../contexts/AppContext.jsx";
import api from "./../../api/api.js";
import PreviewTable from "./../preview-table/preview-table.jsx";
import setInvalidCells from "../../utils/setInvalidCells.js";

// Material
import { Box, Typography, Fade, Button } from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";
import VisuallyHiddenInput from "../../material/visually-hidden-input.js";

function Upload() {
  const { fileData, updateFileData, fileDataExists, updateHasAutoMapped } =
    useApp();
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // Mock file upload handler
  const mockFileUpload = async (e) => {
    setIsLoadingFile(true);

    try {
      // Reset auto mapping control flag when new file is uploaded
      updateHasAutoMapped(false);

      // Call API with file content and handle errors
      const uploadResponse = await fetch(
        api.uploadFile.url,
        api.uploadFile.config
      );

      if (!uploadResponse.ok) {
        throw new Error(
          `Failed to upload file: ${uploadResponse.status} - ${uploadResponse.statusText}`
        );
      }

      // Map data from API to more suitable format
      const uploadResult = await uploadResponse.json();
      updateFileData(mapExcelData(uploadResult));
    } catch (error) {
      console.error("An error ocurred when trying to upload you file:", error);
    } finally {
      setIsLoadingFile(false);
    }
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
      rows: setInvalidCells(
        data.map((row) =>
          row.reduce(
            (acc, columnValue, index) => ({
              ...acc,
              [headers[index]]: columnValue,
            }),
            {}
          )
        )
      ),
    };
  };

  return (
    <>
      <Fade in timeout={2000}>
        <Box>
          <Typography variant="h6" color="secondary" sx={{ mb: 3 }}>
            To get started, upload your object file.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Button
              loading={isLoadingFile}
              component="label"
              loadingPosition="start"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<UploadFileOutlined />}
            >
              Upload files (xlsx, csv)
              <VisuallyHiddenInput
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={mockFileUpload}
              />
            </Button>
          </Box>
        </Box>
      </Fade>
      {!isLoadingFile && fileDataExists() && (
        <Fade in timeout={2000}>
          <Box>
            <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
              Here is a preview of your data:
            </Typography>
            <PreviewTable
              columns={fileData.columns}
              rows={fileData.rows.slice(0, 5)}
              showMappings={false}
            />
          </Box>
        </Fade>
      )}
    </>
  );
}

export default Upload;
