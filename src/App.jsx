// Main imports
import "./App.css";
import { useApp } from "./contexts/AppContext";

// Components
import Upload from "./components/upload/upload";
import Mapping from "./components/mapping/mapping";
import DataPreview from "./components/data-preview/data-preview";
import Summary from "./components/summary/summary";

function App() {
  const componentMap = {
    1: <Upload />,
    2: <Mapping />,
    3: <DataPreview />,
    4: <Summary />,
  };

  const { step, previousStep, nextStep, canStepForward, canStepBackwards } =
    useApp();

  return (
    <>
      <div>Object Importer</div>
      <div>Current Step: {step}</div>
      <div>{componentMap[step]}</div>
      <div>
        <button onClick={previousStep} disabled={!canStepBackwards()}>
          Previous step
        </button>
        <button onClick={nextStep} disabled={!canStepForward()}>
          Next step
        </button>
      </div>
    </>
  );
}

export default App;
