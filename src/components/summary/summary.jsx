import React, { useEffect, useState } from "react";
import { useApp } from "../../contexts/AppContext.jsx";
import api from "./../../api/api.js";

function Summary() {
  const [summary, setSummary] = useState({});
  const { fileData } = useApp();

  useEffect(() => {
    // Call summary to get mapping results
    const getSummary = async () => {
      try {
        const mappingResponse = await fetch(api.confirm.url, {
          ...api.confirm.config,
          body: JSON.stringify(fileData),
        });

        if (!mappingResponse.ok) {
          throw new Error(
            `Failed to get mapping summary: ${mappingResponse.status} - ${mappingResponse.statusText}`
          );
        }

        const mappingResults = await mappingResponse.json();
        setSummary(mappingResults);
      } catch (error) {
        console.error(
          "An error ocurred when trying to send the mappings:",
          error.message
        );
      } finally {
      }
    };

    getSummary();
  }, []);

  return (
    <>
      <div>This is the summary step!</div>
      <div>Imported rows: {summary.imported}</div>
      <div>Failed rows: {summary.failed}</div>
      <div>Errors: </div>
      {(summary.errors || []).map((error) => (
        <>
          <div>
            Row: {error.row}: {error.message}
          </div>
        </>
      ))}
    </>
  );
}

export default Summary;
