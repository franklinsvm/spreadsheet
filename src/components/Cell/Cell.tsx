import { Input, InputProps, Td } from "@chakra-ui/react";
import { memo } from "react";

interface CellProps extends InputProps {
  isSelected: boolean;
}

const Cell = memo(
  ({ isSelected, ...props }: CellProps): JSX.Element => {
    return (
      <Td>
        <Input {...props} />
      </Td>
    );
  },
  (prevProps, nextProps) =>
    !nextProps.isSelected && prevProps.value === nextProps.value
);

export default Cell;