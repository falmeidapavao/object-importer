import React, { useEffect, useState } from "react";
import api from "./../../api/api.js";
import { useApp } from "./../../contexts/AppContext.jsx";
import { distance } from "fastest-levenshtein";

function Mapping() {
  const [systemFields, setSystemFields] = useState([]);
  const { fileData, updateFileData, hasAutoMapped, updateHasAutoMapped } =
    useApp();

  useEffect(() => {
    // Fetch system fields from API
    const fetchSystemFields = async () => {
      try {
        const systemFieldsResponse = await fetch(
          api.getSystemFields.url,
          api.getSystemFields.config
        );

        if (!systemFieldsResponse.ok) {
          throw new Error(
            `Failed to get system fields: ${systemFieldsResponse.status} - ${systemFieldsResponse.statusText}`
          );
        }

        const systemFieldsResult = await systemFieldsResponse.json();
        setSystemFields(systemFieldsResult);
      } catch (error) {
        console.error(
          "An error ocurred when trying to get the system fields:",
          error.message
        );
      } finally {
      }
    };

    fetchSystemFields();
  }, []);

  useEffect(() => {
    // After fetching system fields do a smart default mapping:
    // excel columns that have similar names to system fields will be automatically mapped
    // Do this once on mount.
    if (hasAutoMapped || systemFields.length === 0) return;

    const smartMappedColumns = fileData.columns.map((col) => {
      if (!col.mappedTo) {
        const matchingField = systemFields.find((systemFieldId) =>
          fieldNameMatchesColumn(systemFieldId, col.columnName)
        );

        return {
          ...col,
          mappedTo: matchingField || null,
        };
      }

      return col;
    });

    updateColumns(smartMappedColumns);
    updateHasAutoMapped(true);
  }, [systemFields]);

  //
  // Mapping functions
  //

  // Resets an existing mapping
  const resetMapping = () => {
    const updatedColumns = fileData.columns.map((col) => ({
      ...col,
      mappedTo: null,
    }));

    updateColumns(updatedColumns);
  };

  // Maps an excel column into a system field
  const updateMapping = (columnIndex, systemFieldId) => {
    // Set column mapping and remove selected system field from available options
    // Validate if field is already in use
    if (isFieldMapped(systemFieldId)) return;

    const updatedColumns = fileData.columns.map((col, index) => ({
      ...col,
      mappedTo: columnIndex === index ? systemFieldId : col.mappedTo,
    }));

    updateColumns(updatedColumns);
  };

  // Removes a single mapping
  const removeMapping = (columnIndex) => {
    const updatedColumns = fileData.columns.map((col, index) => ({
      ...col,
      mappedTo: columnIndex === index ? null : col.mappedTo,
    }));

    updateColumns(updatedColumns);
  };

  // Checks if system field already has mapping
  const isFieldMapped = (systemFieldId) =>
    fileData.columns.some((col) => col.mappedTo === systemFieldId);

  // Update data columns
  const updateColumns = (columns) => {
    updateFileData({
      ...fileData,
      columns,
    });
  };

  // Check similarities between 2 strings(using levenshtein distance)
  const fieldNameMatchesColumn = (systemField, column) =>
    distance(systemField, column) < 3;

  return (
    <>
      <div>This is the mapping step!</div>
      <button onClick={resetMapping}>Reset Mapping</button>
      <div>
        {fileData.columns.map((column, columnIndex) => (
          <div key={columnIndex} style={{ display: "flex" }}>
            <div>{column.columnName}</div>
            <div>
              <select
                value={column.mappedTo || ""}
                onChange={(e) => updateMapping(columnIndex, e.target.value)}
              >
                <option value="">None</option>
                {systemFields.map((systemFieldId, systemFieldIndex) => (
                  <option
                    value={systemFieldId}
                    key={systemFieldIndex}
                    disabled={isFieldMapped(systemFieldId)}
                  >
                    {systemFieldId}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={() => removeMapping(columnIndex)}>x</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Mapping;
