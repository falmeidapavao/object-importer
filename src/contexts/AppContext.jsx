import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState(null);
  const [hasAutoMapped, setHasAutoMapped] = useState(false);

  // Step functions
  const nextStep = () =>
    setStep((currStep) => {
      if (canStepForward(currStep)) return currStep + 1;
    });

  const previousStep = () =>
    setStep((currStep) => {
      if (canStepBackwards()) return currStep - 1;
    });

  const canStepForward = () => {
    // Verify if user can step forward in different scenarios
    switch (step) {
      case 1:
        // Steping forward from step 1 is only allowed if an excel file has already been parsed
        return fileDataExists();
      default:
        return step < 4;
    }
  };

  const canStepBackwards = () => {
    return step > 1;
  };

  // Excel parsed file functions
  const updateFileData = (data) => {
    setFileData(data);
  };

  const fileDataExists = () => fileData !== null;

  // Smart map state fucntions
  const updateHasAutoMapped = (hasAutoMapped) => {
    setHasAutoMapped(hasAutoMapped);
  };

  return (
    <AppContext.Provider
      value={{
        step,
        nextStep,
        previousStep,
        canStepForward,
        canStepBackwards,
        fileData,
        updateFileData,
        fileDataExists,
        hasAutoMapped,
        updateHasAutoMapped,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
