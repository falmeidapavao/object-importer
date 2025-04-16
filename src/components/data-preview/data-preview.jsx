import React from "react";
import PreviewTable from "../preview-table/preview-table";
import { useApp } from "./../../contexts/AppContext";

function DataPreview() {
  const { fileData } = useApp();

  return (
    <>
      <div>This is the data preview step!</div>
      <PreviewTable
        columns={fileData.columns}
        rows={fileData.rows}
        showMappings={true}
      />
    </>
  );
}

export default DataPreview;
