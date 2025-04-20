// Sets some of the values on some rows to empty in order to show invalid value validation later
// For demontration purposes only
const simulateInvalidCells = (rows) => {
  return rows.map((row, rowIndex) => {
    if (rowIndex === 2) {
      return { ...row, Voltage: "" };
    }

    if (rowIndex === 6) {
      return { ...row, Manufacturer: "" };
    }

    return row;
  });
};

export default setInvalidCells;
