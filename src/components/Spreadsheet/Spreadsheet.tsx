import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    VStack,
    HStack,
    Button,
  } from "@chakra-ui/react";
  import { useMemo, useState, useCallback } from "react";
  import { SpreadsheetClass } from "../../spreadsheet/Spreadsheet";
  import {
    SpreadsheetMatrix,
    Position,
    SpreadsheetInitializer,
  } from "../../spreadsheet/types";
  import Cell from "../Cell";
  
  const Spreadsheet = (props: SpreadsheetInitializer): JSX.Element => {
    const spreadsheet = useMemo(() => new SpreadsheetClass(props), [props]);
    const initialMatrix = useMemo(() => spreadsheet.getMatrix(), [spreadsheet]);
    const [matrix, setMatrix] = useState<SpreadsheetMatrix>(initialMatrix);
    const [selectedPosition, setSelectedPosition] = useState<Position>({
      row: 0,
      col: 0,
    });
    const [formula, setFormula] = useState("");
  
    const onUpdateCell = useCallback(
      (rowIndex: number, cellIndex: number): void => {
        const currentValue = spreadsheet.getCellValue(rowIndex, cellIndex);
        if (formula !== currentValue.formula) {
          spreadsheet.updateCellFormula(formula, rowIndex, cellIndex);
          setMatrix(spreadsheet.getMatrix());
        }
      },
      [spreadsheet, formula]
    );
  
    const switchSelectedCell = useCallback(
      (row: number, col: number): void => {
        const currentValue = spreadsheet.getCellValue(row, col);
        setSelectedPosition({ row, col });
        setFormula(currentValue.formula);
      },
      [spreadsheet]
    );
  
    const onClickGetLink = useCallback(() => {
      const id = spreadsheet.getId();
      const link = `${window.location.origin}/${id}`;
      localStorage.setItem(id, JSON.stringify({ matrix }));
      alert(`Please use this link to open this spreadsheet: ${link}`);
    }, [spreadsheet, matrix]);
  
    if (!matrix || matrix.length === 0) return <></>;
  
    return (
      <VStack alignItems="start" spacing="2rem" my="2vh">
        <HStack alignSelf="center" w="90vw">
          <Input
            placeholder="fx:"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            onBlur={() =>
              onUpdateCell(selectedPosition.row, selectedPosition.col)
            }
          />
          <Button onClick={onClickGetLink}>Get Link</Button>
        </HStack>
        <VStack alignItems="start" w="100vw" h="80vh" overflow="auto">
          <Table colorScheme="green" size="sm">
            <Thead>
              <Tr>
                <Th></Th>
                {matrix[0].map((_, index) => {
                  const columnName = spreadsheet.getColumnName(index);
                  return (
                    <Th key={columnName} textAlign="center">
                      {columnName}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {matrix.map((column, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  {column.map((cell, cellIndex) => {
                    const { row, col } = selectedPosition;
                    const isSelected = index === row && cellIndex === col;
                    return (
                      <Cell
                        key={`${index}-${cellIndex}`}
                        w="5rem"
                        isSelected={isSelected}
                        value={isSelected ? formula : cell.parsedValue}
                        onChange={(e) => setFormula(e.target.value)}
                        onFocus={() => switchSelectedCell(index, cellIndex)}
                        onBlur={() => onUpdateCell(index, cellIndex)}
                      />
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </VStack>
    );
  };
  
  export default Spreadsheet;