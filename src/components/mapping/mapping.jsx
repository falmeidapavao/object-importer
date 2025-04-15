import React, { useEffect, useState } from "react";
import api from "./../../api/api.js";
import { useApp } from "./../../contexts/AppContext.jsx";

function Mapping() {
  const [systemFields, setSystemFields] = useState([]);
  const { fileData, updateFileData } = useApp();
  console.log(fileData);
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

  return (
    <>
      <div>This is the mapping step!</div>
      <div>
        {fileData.columns.map((column) => {
          <div style={{ display: "flex" }}>
            <div>{column.columnName}</div>
            <div>
              <select value={null}>
                {systemFields.map((field, fieldIndex) => {
                  <option value={field} key={fieldIndex}></option>;
                })}
              </select>
            </div>
          </div>;
        })}
      </div>
    </>
  );
}

export default Mapping;
