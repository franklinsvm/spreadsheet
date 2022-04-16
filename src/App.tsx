import React from "react";
import Spreadsheet from "./components/Spreadsheet";
import { SpreadsheetInitializer } from "./spreadsheet/types";

const loadSpreadsheet = (): SpreadsheetInitializer | null => {
  const path = window.location.pathname;
  if (path.length > 1) {
    const id = path.substring(1);
    const localStorageValue = localStorage.getItem(id);
    if (localStorageValue) {
      try {
        const { matrix } = JSON.parse(localStorageValue);
        if (matrix.length > 0 && matrix[0].length > 0) {
          return { id, matrix };
        }
      } catch {}
    }
  }
  return null;
};

function App() {
  const spreadsheet = loadSpreadsheet();

  return spreadsheet ? (
    <Spreadsheet {...spreadsheet} />
  ) : (
    <Spreadsheet rows={100} cols={30} />
  );
}

export default App;