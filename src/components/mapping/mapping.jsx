import React, { useEffect, useState } from "react";
import api from "./../../api/api.js";
import { useApp } from "./../../contexts/AppContext.jsx";
import { distance } from "fastest-levenshtein";

function Mapping() {
  const [systemFields, setSystemFields] = useState([]);
  const { fileData, updateFileData } = useApp();

  useEffect(() => {
    // Fetch system fields from API
    const fetchSystemFields = async () => {
      try {
        const systemFieldsResponse = await fetch(api.getSystemFields.url);

        if (!systemFieldsResponse.ok) {
          throw new Error("Failed to get system fields");
        }

        const systemFieldsResult = await systemFieldsResponse.json();
        console.log(systemFieldsResult);
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

  // Maps
  const systemFieldOnChange = (columnIndex, field) => {
    // Set column mapping and remove selected system field from available options
    // Validate if field options have been exhausted in other columns
    const updatedColumns = fileData.columns.map((col, index) => ({
      ...col,
      mappedTo: columnIndex === index ? field : col.mappedTo,
    }));

    updateColumns(updatedColumns);
  };

  // Check if system field already has mapping
  const isFieldMapped = (field) =>
    fileData.columns.some((col) => col.mappedTo === field);

  // Update data columns
  const updateColumns = (columns) => {
    updateFileData({
      ...fileData,
      columns,
    });
  };

  // Initializes system field dropdown
  const initFieldDropdown = (column, columnIndex) => {
    /*if (!column.mappedTo) {
      // If column is not mapped check if any system field is similar to column name(smart initialization)
      const matchingField = systemFields.find((field) =>
        fieldNameMatchesColumn(field, column.columnName)
      );

      // Match found, set column mappedTo and return match
      if (matchingField !== undefined) {
        const updatedColumns = fileData.columns.map((col, index) => ({
          ...col,
          mappedTo: index === columnIndex ? matchingField : col.mappedTo,
        }));

        updateColumns(updateColumns);

        return matchingField;
      }
    }*/

    return column.mappedTo;
  };

  // Check similarities between 2 strings(using levenshtein distance)
  // to auto select system fields that match the name of imported file columns
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
                value={initFieldDropdown(column, columnIndex)}
                onChange={(e) =>
                  systemFieldOnChange(columnIndex, e.target.value)
                }
              >
                <option value="">None</option>
                {systemFields.map((field, fieldIndex) => (
                  <option
                    value={field}
                    key={fieldIndex}
                    disabled={isFieldMapped(field)}
                  >
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Mapping;
