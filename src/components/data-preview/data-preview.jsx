import React from "react";
import PreviewTable from "../preview-table/preview-table";
import { useApp } from "./../../contexts/AppContext";

function DataPreview() {
  const { fileData } = useApp();

  const numOfMappedColumns = fileData.columns.filter(
    (col) => col.mappedTo !== null
  ).length;

  return (
    <>
      <div>This is the data preview step!</div>
      <div>{`${numOfMappedColumns} out of ${fileData.columns.length} were mapped to system fields`}</div>
      <PreviewTable
        columns={fileData.columns}
        rows={fileData.rows}
        showMappings={true}
      />
    </>
  );
}

export default DataPreview;
