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
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const { fileData, updateFileData, hasAutoMapped, updateHasAutoMapped } =
    useApp();

  useEffect(() => {
    // Fetch system fields from API
    const fetchSystemFields = async () => {
      try {
        setIsLoadingFields(true);

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
        setIsLoadingFields(false);
      }
    };

    fetchSystemFields();
  }, []);

  useEffect(() => {
    // After fetching system fields do a smart default mapping:
    // excel columns that have similar names to system fields will be automatically mapped
    // Do this once after the assigment of system fields.
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

  // Resets all mappings
  const resetMapping = () => {
    const updatedColumns = fileData.columns.map((col) => ({
      ...col,
      mappedTo: null,
    }));

    updateColumns(updatedColumns);
  };

  // Exposes reset mapping function to parent components
  useImperativeHandle(ref, () => ({
    resetColumnMappings() {
      resetMapping();
    },
  }));

  // Maps an excel column into a system field
  const updateMapping = (columnIndex, systemFieldId) => {
    // Validate if field is already in use
    if (isFieldMapped(systemFieldId)) return;

    // Convert entries from empty select option to null to respect structure format
    const effectiveFieldId = systemFieldId === "" ? null : systemFieldId;

    const updatedColumns = fileData.columns.map((col, index) => ({
      ...col,
      mappedTo: columnIndex === index ? effectiveFieldId : col.mappedTo,
    }));

    updateColumns(updatedColumns);
  };

  // Checks if system field already has mapping
  const isFieldMapped = (systemFieldId) =>
    fileData.columns.find((col) => col.mappedTo === systemFieldId);

  // Checks similarities between 2 strings(using levenshtein distance)
  const fieldNameMatchesColumn = (systemField, column) =>
    distance(systemField, column) < 3;

  // Updates data columns in context
  const updateColumns = (columns) => {
    updateFileData({
      ...fileData,
      columns,
    });
  };

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
                  {isLoadingFields ? (
                    <MenuItem disabled value="">
                      Loading...
                    </MenuItem>
                  ) : (
                    systemFields.map((systemFieldId, systemFieldIndex) => (
                      <MenuItem
                        value={systemFieldId}
                        key={systemFieldIndex}
                        disabled={isFieldMapped(systemFieldId)}
                      >
                        {systemFieldId}
                      </MenuItem>
                    ))
                  )}
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
