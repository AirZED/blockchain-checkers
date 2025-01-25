import { ReactElement, Fragment } from "react";

export enum Labels {
  Light = "light",
  Dark = "dark",
}

type CellProps = {
  label: Labels;
};

// let dartType = {
//   dark: "bg-[#503D28]",
//   light: "bg-[#E0A962]",
// };

export const Cell = ({ label }: CellProps): ReactElement => {
  return (
    <div
      className={`${
        label == Labels.Light ? "bg-[#EDCC8F]" : "bg-[#855E44]"
      } h-16 w-16`}
    ></div>
  );
};

export class CellModel {
  readonly x: number;
  readonly y: number;
  readonly label: Labels;
  board: BoardModel;
  available: boolean;
  key: string;

  constructor(x: number, y: number, label: Labels, board: BoardModel) {
    this.x = x; // x coord
    this.y = y; // y coord
    this.label = label;
    this.board = board;
    this.available = false; // is it free for figure
    this.key = `${String(x)}${String(y)}`;
  }
}

export class BoardModel {
  cells: CellModel[][] = [];
  cellsInRow = 8;

  createCells() {
    for (let i = 0; i < this.cellsInRow; i += 1) {
      const row: CellModel[] = [];

      for (let j = 0; j < this.cellsInRow; j += 1) {
        if ((i + j) % 2 !== 0) {
          row.push(new CellModel(i, j, Labels.Dark, this)); // dark
        } else {
          row.push(new CellModel(i, j, Labels.Light, this)); // light
        }
      }
      this.cells.push(row);
    }
  }
}

type BoardProps = {
  board: BoardModel;
  onSetBoard: (board: BoardModel) => void;
};

export const Board = ({ board, onSetBoard }: BoardProps): ReactElement => {
  return (
    <div className="flex flex-wrap w-[calc(64px*8)] h-[calc(64px*8)]">
      {board.cells.map((row, index) => (
        <Fragment key={index}>
          {row.map((cell) => (
            <Cell label={cell.label} key={cell.key} />
          ))}
        </Fragment>
      ))}
    </div>
  );
};
