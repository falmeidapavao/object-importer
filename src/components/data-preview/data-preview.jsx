import React from "react";
import PreviewTable from "../preview-table/preview-table";
import { useApp } from "./../../contexts/AppContext";
import { Typography } from "@mui/material";

function DataPreview() {
  const { fileData } = useApp();

  const numOfMappedColumns = fileData.columns.filter(
    (col) => col.mappedTo !== null
  ).length;

  return (
    <>
      <Typography
        variant="h6"
        color="secondary"
        sx={{ mb: 3 }}
      >{`${numOfMappedColumns} out of ${fileData.columns.length} columns were mapped to system fields`}</Typography>
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
