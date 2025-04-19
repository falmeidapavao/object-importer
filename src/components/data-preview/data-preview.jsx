import React from "react";
import PreviewTable from "../preview-table/preview-table";
import { useApp } from "./../../contexts/AppContext";

// Material
import { Box, Alert, Typography, Fade } from "@mui/material";
import { Circle } from "@mui/icons-material";

function DataPreview() {
  const { fileData } = useApp();

  const getNumOfMappedColumns = fileData.columns.filter(
    (col) => col.mappedTo !== null
  ).length;

  const getInvalidRows = () => {
    return fileData.rows.reduce((acc, row, rowIndex) => {
      // Build an array with elements in the following format:
      // { row: 1, missingValues: ["Manufacturer", "Model"] }
      const missingRowValues = Object.keys(row).filter((key) => !row[key]);
      if (missingRowValues.length)
        return [...acc, { rowNum: rowIndex + 1, missingRowValues }];

      return acc;
    }, []);
  };

  // Returns a MUI alert severity based on the # of mapped columns
  const getMappedColumnsAlertSeverity = () => {
    return getNumOfMappedColumns === 0
      ? "error"
      : getNumOfMappedColumns < fileData.columns.length
      ? "warning"
      : "success";
  };

  // Returns a descriptive string based on the # of mapped columns
  const getMappedColumnsAlertText = () => {
    return getNumOfMappedColumns === 0
      ? "No columns were mapped"
      : getNumOfMappedColumns < fileData.columns.length
      ? `Only ${getNumOfMappedColumns} out of ${fileData.columns.length} columns were mapped`
      : "All columns were mapped";
  };

  return (
    <Fade in timeout={2000}>
      <Typography variant="h6" color="secondary" sx={{ mb: 1 }}>
        Here is a wrap up of your mapping:
      </Typography>
      {getInvalidRows().length > 0 ? (
        <Alert severity="error" sx={{ mb: 1 }}>
          <Box>You have missing values in some fields</Box>
          {getInvalidRows().map((row, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{ display: "flex", alignItems: "center", columnGap: 0.5 }}
            >
              <Circle sx={{ fontSize: "0.4rem" }} />
              <Box>
                Row {row.rowNum}:{" "}
                {row.missingRowValues.map((missingValue) => missingValue)}
              </Box>
            </Box>
          ))}
        </Alert>
      ) : (
        ""
      )}
      <Alert severity={getMappedColumnsAlertSeverity()} sx={{ mb: 3 }}>
        {getMappedColumnsAlertText()}
      </Alert>
      <PreviewTable
        columns={fileData.columns}
        rows={fileData.rows}
        showMappings={true}
        hasPagination={true}
        rowsPerPage={5}
      />
    </Fade>
  );
}

export default DataPreview;
