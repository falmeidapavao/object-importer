import React, { useEffect, useState } from "react";
import { useApp } from "../../contexts/AppContext.jsx";
import api from "./../../api/api.js";

// Material
import { Box, Fade, LinearProgress, Alert, Typography } from "@mui/material";
import { Circle } from "@mui/icons-material";

function Summary() {
  const [summary, setSummary] = useState({});
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { fileData } = useApp();

  useEffect(() => {
    // Call summary to get mapping results
    const getSummary = async () => {
      try {
        setIsLoadingSummary(true);

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
        setIsLoadingSummary(false);
      }
    };

    getSummary();
  }, []);

  return (
    <>
      {isLoadingSummary ? (
        <LinearProgress />
      ) : (
        <Fade in={!isLoadingSummary} timeout={2000}>
          <Box>
            <Typography variant="h6" color="secondary" sx={{ mb: 3 }}>
              Here is a summary of your work:
            </Typography>
            <Alert severity="success" sx={{ mb: 1 }}>
              Imported rows: {summary.imported}
            </Alert>
            <Alert severity="error">
              Failed rows: {summary.failed}
              <Box>
                {(summary.errors || []).map((error, errorIndex) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: 0.5,
                    }}
                    key={errorIndex}
                  >
                    <Circle sx={{ fontSize: "0.4rem" }} />
                    <Box>
                      Row: {error.row}: {error.message}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Alert>
          </Box>
        </Fade>
      )}
    </>
  );
}

export default Summary;
