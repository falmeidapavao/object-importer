import React from "react";
import PreviewTable from "../preview-table/preview-table";
import { useApp } from "./../../contexts/AppContext";
import { Alert } from "@mui/material";

function DataPreview() {
  const { fileData } = useApp();

  const numOfMappedColumns = fileData.columns.filter(
    (col) => col.mappedTo !== null
  ).length;

  return (
    <>
      <Alert severity="info" sx={{ mb: 3 }}>
        {`${numOfMappedColumns} out of ${fileData.columns.length} file columns were mapped to system fields`}
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
