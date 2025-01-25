import { Labels, Letters } from "../../utils/contants";

import { ReactElement, Fragment } from "react";
import { FigureModel } from "./Figure";

export class CellModel {
  readonly x: number;
  readonly y: number;
  readonly label: Labels;
  figure: FigureModel | null; // our figure

  available: boolean;
  key: string;
  id: string;

  constructor(x: number, y: number, label: Labels, id: string) {
    this.x = x; // x coord
    this.y = y; // y coord
    this.label = label;
    this.available = false; // is it free for figure
    this.key = `${String(x)}${String(y)}`;
    this.figure = null; // null by default
    this.id = id;
  }

  isForwardCell(targetCell: CellModel, selectedFigure: FigureModel): boolean {
    const { cell, label } = selectedFigure;

    const dx = Math.abs(cell.x - targetCell.x);
    const dy = cell.y - targetCell.y;

    return label === Labels.Light
      ? dx === 1 && dy === 1
      : dx === 1 && dy === -1;
  }

  moveFigure(targetCell: CellModel) {
    if (this.figure && this.figure.canMove(targetCell)) {
      targetCell.figure = this.figure; // set figure on target cell
      this.figure = null; // clean current cell
    }
  }
}

type CellProps = {
  cell: CellModel;
  colomnIndex: number;
  rowIndex: number;
  selected: boolean;
  onCellClick: (cell: CellModel) => void;
};

export const Cell = ({
  cell,
  rowIndex,
  colomnIndex,
  selected,
  onCellClick,
}: CellProps): ReactElement => {
  const { figure, label } = cell;

  return (
    <Fragment>
      <div
        className={`${
          label == Labels.Light ? "bg-[#EDCC8F]" : "bg-[#855E44]"
        } ${
          selected ? "" : ""
        } h-16 w-16 flex items-center justify-center cursor-pointer`}
        onClick={() => onCellClick(cell)}
      >
        {(rowIndex === 1 || rowIndex === 8) && (
          <div
            className={`${
              rowIndex === 1 ? "translate-y-[-50px]" : "translate-y-[50px]"
            } absolute`}
          >
            {Letters[colomnIndex]}
          </div>
        )}

        {(colomnIndex === 1 || colomnIndex === 8) && (
          <div
            className={`${
              colomnIndex === 1 ? "translate-x-[-50px]" : "translate-x-[50px]"
            } absolute`}
          >
            {9 - rowIndex}
          </div>
        )}

        {cell.available && !cell.figure && (
          <div className="bg-white w-2.5 h-2.5 rounded-full" />
        )}

        {figure?.imageSrc && (
          <img
            className={`h-12 cursor-pointer ${
              selected ? "animate-scaling" : ""
            }`}
            src={figure.imageSrc}
            alt={figure.name}
          />
        )}
      </div>
    </Fragment>
  );
};
