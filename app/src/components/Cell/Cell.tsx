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
    this.x = y; // x coord
    this.y = x; // y coord
    this.label = label;
    this.available = false; // is it free for figure
    this.key = `x=${y} y=${x}`;
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

  isOnBoard(): boolean {
    return this.x >= 1 && this.x <= 8 && this.y >= 1 && this.y <= 8;
  }

  getMoveTarget(selectedCell: CellModel) {
    const { x, y } = selectedCell;

    let moves = [];

    if (y >= 2) {
      x >= 2 && moves.push({ x: x - 1, y: y - 1 });
      x <= 7 && moves.push({ x: x + 1, y: y - 1 });
    }

    if (y <= 7) {
      x >= 2 && moves.push({ x: x - 1, y: y + 1 });
      x <= 7 && moves.push({ x: x + 1, y: y + 1 });
    }

    return moves;
  }

  getJumpsTarget(selectedCell: CellModel) {
    const { x, y } = selectedCell;
    let jumps = [];

    if (y >= 3) {
      x >= 3 && jumps.push({ x: x - 2, y: y - 2 });
      x <= 6 && jumps.push({ x: x + 2, y: y - 2 });
    }

    if (y <= 6) {
      x >= 3 && jumps.push({ x: x - 2, y: y + 2 });
      x <= 6 && jumps.push({ x: x + 2, y: y + 2 });
    }

    return jumps;
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
              rowIndex === 1 ? "translate-x-[-50px]" : "translate-x-[50px]"
            } absolute`}
          >
            {Letters[colomnIndex]}
            {colomnIndex}
          </div>
        )}

        {(colomnIndex === 1 || colomnIndex === 8) && (
          <div
            className={`${
              colomnIndex === 1 ? "translate-y-[-50px]" : "translate-y-[50px]"
            } absolute`}
          >
            {rowIndex}
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
