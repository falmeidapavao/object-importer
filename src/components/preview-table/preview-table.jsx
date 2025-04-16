import React from "react";

function PreviewTable({ columns = [], rows = [], showMappings = false }) {
  // Validate invalid/no columns being passed
  if (!columns || columns.length === 0) {
    return <div>Please provide the columns for the table.</div>;
  }

  // Validate invalid/no rows being passed
  if (!rows || rows.length === 0) {
    return <div>Please provide the rows for the table.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, columnIndex) => (
            <th key={columnIndex}>
              {column.columnName}
              {column.mappedTo !== null && showMappings
                ? ` mapped to "${column.mappedTo}"`
                : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PreviewTable;
