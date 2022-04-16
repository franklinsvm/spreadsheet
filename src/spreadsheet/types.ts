export interface CellValue {
    formula: string;
    parsedValue: string;
  }
  
  export type SpreadsheetMatrix = CellValue[][];
  
  export interface Position {
    row: number;
    col: number;
  }
  
  interface NewSpreadsheet {
    rows: number;
    cols: number;
  }
  
  interface LoadedSpreadsheet {
    id: string;
    matrix: SpreadsheetMatrix;
  }
  
  export type SpreadsheetInitializer = NewSpreadsheet | LoadedSpreadsheet;