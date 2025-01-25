import { ReactElement, Fragment, useState, useEffect } from "react";
import pieceImgLight from "../../assets/white.png";
import pieceImgDark from "../../assets/black.png";
import { PlayerModel } from "../Player/Player";

export enum Labels {
  Light = "light",
  Dark = "dark",
}

export enum Letters {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
}

export class CellModel {
  readonly x: number;
  readonly y: number;
  readonly label: Labels;
  figure: FigureModel | null; // our figure
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
    this.figure = null; // null by default
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
  cellIndex: number;
  rowIndex: number;
  selected: boolean;
  onCellClick: (cell: CellModel) => void;
};

// let dartType = {
//   dark: "bg-[#503D28]",
//   light: "bg-[#E0A962]",
// };

export enum FigureNames {
  Piece = "Piece",
  Dame = "Dame",
}

class FigureModel {
  label: Labels;
  imageSrc: string;
  isCrowned: boolean;
  cell: CellModel;
  name: FigureNames;

  constructor(label: Labels, cell: CellModel) {
    this.label = label;
    this.cell = cell;
    this.cell.figure = this;
    this.isCrowned = false;
    this.name = FigureNames.Piece;
    this.imageSrc = label === Labels.Light ? pieceImgLight : pieceImgDark;
  }

  canMove(targetCell: CellModel): boolean {
    console.log(this.cell.isForwardCell(targetCell, this));
    return this.cell.isForwardCell(targetCell, this);
  }
}

export const Cell = ({
  cell,
  rowIndex,
  cellIndex,
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
        {(rowIndex === 0 || rowIndex === 7) && (
          <div
            className={`${
              rowIndex === 0 ? "translate-y-[-50px]" : "translate-y-[50px]"
            } absolute`}
          >
            {Letters[cellIndex]}
          </div>
        )}

        {(cellIndex === 0 || cellIndex === 7) && (
          <div
            className={`${
              cellIndex === 0 ? "translate-x-[-50px]" : "translate-x-[50px]"
            } absolute`}
          >
            {8 - rowIndex}
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

export class BoardModel {
  cells: CellModel[][] = [];
  cellsInRow = 8;

  getCell(x: number, y: number): CellModel {
    return this.cells[y][x];
  }

  addFigure(label: Labels, x: number, y: number) {
    new FigureModel(label, this.getCell(x, y));
  }

  getNewBoard(): BoardModel {
    const newBoard = new BoardModel();
    newBoard.cells = this.cells;
    return newBoard;
  }

  highlightCells(selectedCell: CellModel) {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.available = !!selectedCell?.figure?.canMove(cell);
      });
    });
  }

  addFigures() {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (rowIndex <= 2 && cell.label === Labels.Dark) {
          new FigureModel(Labels.Dark, this.getCell(cellIndex, rowIndex)); // add dark pieces to first 3 rows
        } else if (
          rowIndex >= this.cells.length - 3 &&
          cell.label === Labels.Dark
        ) {
          new FigureModel(Labels.Light, this.getCell(cellIndex, rowIndex)); // add light pieces to last 3 rows
        }
      });
    });
  }

  createCells() {
    for (let i = 0; i < this.cellsInRow; i += 1) {
      const row: CellModel[] = [];

      for (let j = 0; j < this.cellsInRow; j += 1) {
        if ((i + j) % 2 !== 0) {
          row.push(new CellModel(j, i, Labels.Dark, this)); // dark
        } else {
          row.push(new CellModel(j, i, Labels.Light, this)); // light
        }
      }
      this.cells.push(row);
    }
  }
}

type BoardProps = {
  board: BoardModel;
  onSetBoard: (board: BoardModel) => void;
  currentPlayer: PlayerModel;
  onChangePlayer: () => void;
};

export const Board = ({
  board,
  onSetBoard,
  onChangePlayer,
  currentPlayer,
}: BoardProps): ReactElement => {
  const [selected, setSelected] = useState<CellModel | null>(null);

  const handleCellClick = (cell: CellModel) => {
    if (selected && selected !== cell && selected.figure?.canMove(cell)) {
      selected.moveFigure(cell);
      setSelected(null);
      onChangePlayer(); // change player after we move the figure
      updateBoard();
    } else {
      if (cell.figure?.label === currentPlayer.label) {
        // we can only select our figures
        setSelected(cell);
      }
    }
  };

  const highlightCells = () => {
    board.highlightCells(selected as CellModel);
    updateBoard();
  };

  const updateBoard = () => {
    const updatedBoard = board.getNewBoard();
    onSetBoard(updatedBoard);
  };

  useEffect(() => {
    highlightCells();
  }, [selected]);

  return (
    <div className="flex flex-wrap w-[calc(64px*8)] h-[calc(64px*8)] relative">
      {board.cells.map((row, rowIndex) => (
        <Fragment key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <Cell
              cell={cell}
              key={cell.key}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
              selected={selected?.x === cell.x && selected.y === cell.y} // check if selected cell coords equal to rendered cell
              onCellClick={handleCellClick}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
};
