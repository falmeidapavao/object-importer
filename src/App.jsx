// Main imports
import "./App.css";
import { useApp } from "./contexts/AppContext";

// Components
import Upload from "./components/upload/upload";
import Mapping from "./components/mapping/mapping";
import DataPreview from "./components/data-preview/data-preview";
import Summary from "./components/summary/summary";

// Material
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Slide,
} from "@mui/material";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";

function App() {
  const { step, previousStep, nextStep, canStepForward, canStepBackwards } =
    useApp();

  // Hash map for steps and their components
  const stepMap = {
    1: {
      component: <Upload />,
      stepLabel: "File Upload",
      previousStepLabel: null,
      nextStepLabel: "Map your columns",
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
    <>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ backgroundColor: (theme) => theme.palette.neutral0.main }}
      >
        <Toolbar>
          <Box
            component="img"
            src="src/assets/inventsys_logo.png"
            alt="Inventsys Logo"
            sx={{ height: 60, mr: 2, mt: 0.5 }}
          />
          <Typography variant="h6" component="div">
            Object Importer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Stepper activeStep={step - 1} sx={{ mb: 3 }}>
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
            mt: 3,
          }}
        >
          <Fade in={canStepBackwards()} timeout={1000}>
            <Button
              variant="contained"
              color="secondary"
              onClick={previousStep}
            >
              <ChevronLeft sx={{ mr: 1 }} />
              {stepMap[step].previousStepLabel}
            </Button>
          </Fade>
          <Slide direction="left" timeout={1000} in={canStepForward()}>
            <Button
              variant="contained"
              color="secondary"
              onClick={nextStep}
              sx={{ ml: 1 }}
            >
              {stepMap[step].nextStepLabel}
              <ChevronRight />
            </Button>
          </Slide>
        </Box>
      </Container>
    </>
  );
}

export default App;
