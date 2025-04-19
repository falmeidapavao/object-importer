import React from "react";
import PreviewTable from "../preview-table/preview-table";
import { useApp } from "./../../contexts/AppContext";

// Material
import { Alert, Typography } from "@mui/material";

function DataPreview() {
  const { fileData } = useApp();

  const getNumOfMappedColumns = fileData.columns.filter(
    (col) => col.mappedTo !== null
  ).length;

  return (
    <>
      <Typography variant="h6" color="secondary" sx={{ mb: 3 }}>
        Here is a preview of your mapped data:
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        {`${getNumOfMappedColumns} out of ${fileData.columns.length} file columns were mapped to system fields`}
      </Alert>
      <PreviewTable
        columns={fileData.columns}
        rows={fileData.rows}
        showMappings={true}
        hasPagination={true}
      />
    </>
  );
}

export default DataPreview;
