import React, { FunctionComponent } from "react";

export type TableCellType = "data" | "head";

type TableCellProps = {
  cellType: TableCellType;
  className?: string;
  minWidth?: number;
  maxWidth?: number;
  children?: React.ReactNode;
};

export const TableCell: FunctionComponent<TableCellProps> = ({
  cellType,
  className,
  minWidth,
  children,
  maxWidth,
}) => {
  return cellType === "head" ? (
    <th
      style={{
        minWidth: minWidth ?? undefined,
        maxWidth: maxWidth ?? undefined,
      }}
      className={className}
    >
      {children}
    </th>
  ) : (
    <td
      style={{
        minWidth: minWidth ?? undefined,
        maxWidth: maxWidth ?? undefined,
      }}
      className={className}
    >
      {children}
    </td>
  );
};
