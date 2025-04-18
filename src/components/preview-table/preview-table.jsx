import { useState } from "react";

// Material
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";

function PreviewTable({
  columns = [],
  rows = [],
  showMappings = false,
  hasPagination = false,
}) {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Validate invalid/no columns being passed
  if (!columns || columns.length === 0) {
    return (
      <Typography variant="h6" color="secondary">
        Please provide the columns for the table.
      </Typography>
    );
  }

  // Validate invalid/no rows being passed
  if (!rows || rows.length === 0) {
    return (
      <Typography variant="h6" color="secondary">
        Please provide the rows for the table.
      </Typography>
    );
  }

  // Checks if a column has been mapping
  const columnHasMapping = (column) => column.mappedTo;

  // Pagination handlers
  const pageOnChange = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        columnHasMapping(column) && showMappings
                          ? "center"
                          : "flex-end",
                    }}
                  >
                    <Box>{column.columnName}</Box>
                    {columnHasMapping(column) && showMappings ? (
                      <>
                        <ArrowDownward />
                        <Box
                          sx={{ color: (theme) => theme.palette.error.main }}
                        >
                          "{column.mappedTo}"
                        </Box>
                      </>
                    ) : (
                      ""
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(hasPagination ? paginatedRows : rows).map((row, rowIndex) => {
              return (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <TableCell key={cellIndex} align="right">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {hasPagination ? (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={pageOnChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          labelRowsPerPage=""
        ></TablePagination>
      ) : (
        ""
      )}
    </>
  );
}

export default PreviewTable;
