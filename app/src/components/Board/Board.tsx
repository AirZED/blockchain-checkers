import { ReactElement, Fragment, useState, useEffect } from "react";

import { PlayerModel } from "../Player/Player";
import { Labels, Letters } from "../../utils/contants";
import { Cell, CellModel } from "../Cell/Cell";
import { FigureModel } from "../Cell/Figure";

export class BoardModel {
  cells: CellModel[][] = [];
  cellsInRow = 8;
  cellsInColumn = 8;

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
    for (let y = 1; y <= this.cellsInColumn; y += 1) {
      const row: CellModel[] = [];

      for (let x = 1; x <= this.cellsInRow; x += 1) {
        if ((x + y) % 2 === 0) {
          console.log(new CellModel(x, y, Labels.Dark, `${Letters[y]}${x}`));
          row.push(new CellModel(x, y, Labels.Dark, `${Letters[y]}${x}`)); // dark
        } else {
          console.log(new CellModel(x, y, Labels.Light, `${Letters[y]}${x}`));
          row.push(new CellModel(x, y, Labels.Light, `${Letters[y]}${x}`)); // light
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
    console.log(cell);
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
      {board.cells.map((row, index) => (
        <Fragment key={index}>
          {row.map((cell) => {
            return (
              <Cell
                cell={cell}
                key={cell.key}
                rowIndex={cell.y}
                colomnIndex={cell.x}
                selected={selected?.x === cell.x && selected.y === cell.y} // check if selected cell coords equal to rendered cell
                onCellClick={handleCellClick}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
};
