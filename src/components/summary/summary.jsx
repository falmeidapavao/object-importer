import React, { useEffect, useState } from "react";
import api from "./../../api/api.js";

function Summary() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    // Call summary to get mapping results
    const getSummary = async () => {
      try {
        const mappingResponse = await fetch(api.confirm.url);

        if (!mappingResponse.ok) {
          throw new Error(
            `Failed to get mapping summary: ${mappingResponse.status} - ${mappingResponse.statusText}`
          );
        }

        const mappingResults = await confirmationResponse.json();
        setSummary(mappingResults);
      } catch (error) {
        conso;
      }
    };

    getSummary();
  }, []);

  return <div>This is the summary step!</div>;
}

export default Summary;
