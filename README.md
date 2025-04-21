# Object Importer (ReactJS)

A step-by-step **Object Importer wizard** built with ReactJS. This project allows users to upload CSV/XLSX files, map columns to internal fields, preview the data, and confirm the import with error handling and validation.

---

## Features

- Upload `.csv` and `.xlsx` files
- Live data preview (first 5–10 rows)
- Column-to-field mapping with validation
- Inline error/warning display
- Import summary with success and error breakdown
- Responsive UI with Material UI
- State management with Context API

---

## Wizard Steps

1. **File Upload**

   - Select `.csv`/`.xlsx` file
   - Shows a loading spinner while parsing
   - Show a preview of data with a table

2. **Column Mapping**

   - Map uploaded columns to internal fields using dropdowns
   - Smart map fields that have similar names to excel columns
   - Validate 1:1 mappings

3. **Data Preview**

   - Preview mapped data in a table
   - Indicate errors: missing values, missing mappigns
   - Navigate back to fix mappings if needed

4. **Mapping results & Summary**

   - Simulate API submission
   - Displays import summary (success, errors, warnings)

---

## Tech Stack

- React with Hooks
- Material UI for styling
- Context API for global state

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```
