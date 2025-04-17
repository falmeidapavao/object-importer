import React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

function PreviewTable({
  columns = [],
  rows = [],
  showMappings = false,
  maxRecords = undefined,
}) {
  // Validate invalid/no columns being passed
  if (!columns || columns.length === 0) {
    return <div>Please provide the columns for the table.</div>;
  }

  // Validate invalid/no rows being passed
  if (!rows || rows.length === 0) {
    return <div>Please provide the rows for the table.</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, columnIndex) => (
              <TableCell key={columnIndex}>
                {column.columnName}
                {column.mappedTo !== null && showMappings
                  ? ` mapped to "${column.mappedTo}"`
                  : ""}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => {
            return (
              <TableRow key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PreviewTable;
