import React, { useRef } from "react";
import ColumnMapper from "./../column-mapper/column-mapper.jsx";

// Material
import { Box, Typography, Fade, Button } from "@mui/material";
import { RestartAlt } from "@mui/icons-material";

function Mapping() {
  // Reference for column mapper component, since we want to call reset mappings
  const columMapperRef = useRef();

  return (
    <>
      <Fade in timeout={2000}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6" color="secondary">
              Please set the corresponding system fields.
            </Typography>
            <Box>
              <Typography variant="caption" color="secondary">
                We've given you a little hand and tried to map fields in
                advance.
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="secondary">
                If this selection doesn't satisfy your needs, you can click the
                reset mapping button.
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => columMapperRef.current.resetColumnMappings()}
            >
              <RestartAlt sx={{ mr: 0.5 }} />
              Reset Mapping
            </Button>
          </Box>
        </Box>
      </Fade>
      <Fade in timeout={2000}>
        <Box>
          <ColumnMapper ref={columMapperRef} />
        </Box>
      </Fade>
    </>
  );
}

export default Mapping;
