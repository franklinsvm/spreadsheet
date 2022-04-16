import { v4 } from "uuid";
import { alphabet, alphabetLength } from "./constants";
import {
  CellValue,
  SpreadsheetMatrix,
  Position,
  SpreadsheetInitializer,
} from "./types";

export class SpreadsheetClass {
  id: string;
  matrix: SpreadsheetMatrix;
  rows = 0;
  cols = 0;

  constructor(params: SpreadsheetInitializer) {
    if ("id" in params) {
      const { id, matrix } = params;
      this.id = id;
      this.matrix = matrix;
      this.rows = matrix.length;
      this.cols = matrix[0].length;
    } else {
      const { rows, cols } = params;
      const initialMatrix: SpreadsheetMatrix = [];

      for (let i = 0; i < rows; i++) {
        const length = initialMatrix.push([]);
        for (let j = 0; j < cols; j++) {
          initialMatrix[length - 1].push({ formula: "", parsedValue: "" });
        }
      }
      this.id = v4();
      this.matrix = initialMatrix;
      this.cols = cols;
      this.rows = rows;
    }
  }

  getId(): string {
    return this.id;
  }

  getMatrix(): SpreadsheetMatrix {
    const parsedMatrix: SpreadsheetMatrix = [];
    for (let row of this.matrix) {
      const length = parsedMatrix.push([]);
      for (let cell of row) {
        const parsedValue = this.resolveFormula(cell.formula);
        parsedMatrix[length - 1].push({ ...cell, parsedValue });
      }
    }
    return parsedMatrix;
  }

  getColumnName(index: number): string {
    const repeatTimes = Math.floor(index / alphabetLength);
    const prefix = repeatTimes > 0 ? alphabet[repeatTimes - 1] : "";
    const suffix = alphabet[index % alphabetLength];
    return `${prefix}${suffix}`;
  }

  getCellValue(row: number, col: number): CellValue {
    return this.matrix[row][col];
  }

  updateCellFormula(value: string, row: number, col: number) {
    this.matrix[row][col].formula = value;
  }

  private resolveFormula(
    formula: string,
    visitedPositions?: Position[]
  ): string {
    if (formula.length > 0 && formula[0] === "=") {
      const position = this.parseReference(formula);
      if (!position) return this.getInvalidFormula();

      const isOutOfBounds = this.isOutOfBounds(position);
      if (isOutOfBounds) return this.getOutOfBoundsFormula();

      const visited = visitedPositions ?? [];
      const isCircular = this.isCircularReference(position, visited);
      if (isCircular) return this.getCircularFormula();

      const nextValue = this.matrix[position.row][position.col].formula;
      return this.resolveFormula(nextValue, [position, ...visited]);
    } else {
      return formula;
    }
  }

  private isCircularReference(
    position: Position,
    visitedPositions: Position[]
  ): boolean {
    return visitedPositions.some(
      (pos) => position.col === pos.col && position.row === pos.row
    );
  }

  private isOutOfBounds(position: Position): boolean {
    return position.col >= this.cols || position.row >= this.rows;
  }

  private parseReference(reference: string): Position | null {
    const columnMatch = reference.match("[a-zA-Z]+");
    const rowMatch = reference.match("[0-9]+");
    if (!columnMatch || !rowMatch) return null;
    const column = columnMatch[0].toLocaleLowerCase();
    const row = parseInt(rowMatch[0]) - 1;
    let colIndex;
    if (column.length > 1) {
      const multiplier = alphabet.indexOf(column[0]) + 1;
      colIndex = multiplier * alphabetLength + alphabet.indexOf(column[1]);
    } else {
      colIndex = alphabet.indexOf(column[0]);
    }
    return {
      row,
      col: colIndex,
    };
  }

  private getInvalidFormula(): string {
    return "INVALID FORMULA";
  }

  private getCircularFormula(): string {
    return "CIRCULAR FORMULA";
  }

  private getOutOfBoundsFormula(): string {
    return "OUT OF BOUNDS FORMULA";
  }
}