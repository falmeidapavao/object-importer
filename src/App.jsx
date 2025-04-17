// Main imports
import "./App.css";
import { useApp } from "./contexts/AppContext";

// Components
import Upload from "./components/upload/upload";
import Mapping from "./components/mapping/mapping";
import DataPreview from "./components/data-preview/data-preview";
import Summary from "./components/summary/summary";

// Material
import { Box, Button, Stepper, Step, StepLabel, Fade } from "@mui/material";

function App() {
  const { step, previousStep, nextStep, canStepForward, canStepBackwards } =
    useApp();

  // Hash map for steps and their components
  const stepMap = {
    1: {
      component: <Upload />,
      stepLabel: "File Upload",
      previousStepLabel: null,
      nextStepLabel: "To mapping",
    },
    2: {
      component: <Mapping />,
      stepLabel: "Column Mapping",
      previousStepLabel: "Back to upload",
      nextStepLabel: "Preview mappings",
    },
    3: {
      component: <DataPreview />,
      stepLabel: "Data Preview",
      previousStepLabel: "Back to mappings",
      nextStepLabel: "Confirm & Upload",
    },
    4: {
      component: <Summary />,
      stepLabel: "Import & Summary",
      previousStepLabel: "Preview mappings",
      nextStepLabel: null,
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 3,
        }}
      >
        <h1>Object Importer</h1>
        <Stepper activeStep={step - 1} alternativeLabel>
          {Object.keys(stepMap).map((stepNum) => (
            <Step key={stepNum}>
              <StepLabel>{stepMap[stepNum].stepLabel}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {stepMap[step].component}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Fade in={canStepBackwards()} timeout={1000}>
            <Button variant="contained" color="primary" onClick={previousStep}>
              {stepMap[step].previousStepLabel}
            </Button>
          </Fade>
          <Fade in={canStepForward()} timeout={1000}>
            <Button variant="contained" color="primary" onClick={nextStep}>
              {stepMap[step].nextStepLabel}
            </Button>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
