import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import api from "./../../api/api.js";
import { useApp } from "./../../contexts/AppContext.jsx";
import { distance } from "fastest-levenshtein";

// Material
import { Box, FormControl, Select, MenuItem, Paper } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const ColumnMapper = forwardRef((_, ref) => {
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

  // Resets an existing mapping
  const resetMapping = () => {
    const updatedColumns = fileData.columns.map((col) => ({
      ...col,
      mappedTo: null,
    }));

    updateColumns(updatedColumns);
  };

  // Expose reset mapping function to parent components
  useImperativeHandle(ref, () => ({
    resetColumnMappings() {
      resetMapping();
    },
  }));

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
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 1,
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
          <Box sx={{ width: 200, fontWeight: 600 }}>File Columns</Box>
          <Box sx={{ width: 25 }}></Box>
          <Box sx={{ fontWeight: 600 }}>System fields</Box>
        </Box>
        {fileData.columns.map((column, columnIndex) => (
          <Box
            key={columnIndex}
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <Box
              sx={{
                width: 200,
                border: "1px solid",
                borderColor: "rgba(0, 0, 0, 0.23)",
                borderRadius: 1,
                p: 1.9,
                fontSize: "1rem",
                color: "grey",
                minHeight: 40,
              }}
            >
              {column.columnName}
            </Box>
            <Box sx={{ width: 25 }}>
              <ArrowForward />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl>
                <Select
                  value={column.mappedTo || ""}
                  onChange={(e) => updateMapping(columnIndex, e.target.value)}
                  sx={{ width: 200 }}
                  displayEmpty
                >
                  <MenuItem value="">None</MenuItem>
                  {systemFields.map((systemFieldId, systemFieldIndex) => (
                    <MenuItem
                      value={systemFieldId}
                      key={systemFieldIndex}
                      disabled={isFieldMapped(systemFieldId)}
                    >
                      {systemFieldId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
});

export default ColumnMapper;
