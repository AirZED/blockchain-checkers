import { useState, useEffect, ReactElement } from "react";
import pieceImgLight from "../../assets/white.png";
import pieceImgDark from "../../assets/black.png";
import kingPieceImgLight from "../../assets/whiteKing.png";
import kingPieceImgDark from "../../assets/blackKing.png";
import Coordinate from "./Coordinate";
import { PlayerModel } from "../Player/Player";
import {
  GameEngineState,
  GamePiece,
  Move,
  PieceColor,
} from "../../utils/contants";

const GameEngine = (): ReactElement => {
  const lightPlayer = new PlayerModel(PieceColor.WHITE);
  const darkPlayer = new PlayerModel(PieceColor.BLACK);

  const [state, setState] = useState<GameEngineState>({
    board: Array(8)
      .fill(null)
      .map(() => Array(8).fill(null)),
    currentTurn: lightPlayer,
    moveCount: 0,
  });

  useEffect(() => {
    initializePieces();
  }, []);

  const [selectedPiece, setSelectedPiece] = useState<Coordinate | null>(null);

  const getPiece = (coord: Coordinate): GamePiece | null => {
    console.log("getPiece called with coord:", coord);
    if (!coord.isOnBoard()) {
      return null;
    }
    return state.board[coord.x][coord.y];
  };

  const isCellSelected = (x: number, y: number): boolean => {
    return selectedPiece?.x === x && selectedPiece?.y === y;
  };

  const getJumpedCoordinate = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): Coordinate | null => {
    if (toX === fromX + 2 && toY === fromY + 2) {
      return new Coordinate(fromX + 1, fromY + 1);
    } else if (toX === fromX - 2 && toY === fromY - 2) {
      return new Coordinate(fromX - 1, fromY - 1);
    } else if (toX === fromX - 2 && toY === fromY + 2) {
      return new Coordinate(fromX - 1, fromY + 1);
    } else if (toX === fromX + 2 && toY === fromY - 2) {
      return new Coordinate(fromX + 1, fromY - 1);
    }
    return null;
  };
  const validMove = (
    piece: GamePiece,
    from: Coordinate,
    to: Coordinate
  ): boolean => {
    if (!to.isOnBoard()) return false;

    // Check if destination is empty
    if (getPiece(to)) return false;

    const { y: fy } = from;
    const { y: ty } = to;

    let valid = false;

    if (ty > fy && piece.color === PieceColor.WHITE) {
      valid = true;
    }
    if (ty < fy && piece.color === PieceColor.BLACK) {
      valid = true;
    }
    if (ty > fy && piece.color === PieceColor.BLACK && piece.crowned) {
      valid = true;
    }
    if (ty < fy && piece.color === PieceColor.WHITE && piece.crowned) {
      valid = true;
    }

    return valid;
  };

  const validJump = (
    piece: GamePiece,
    from: Coordinate,
    to: Coordinate
  ): boolean => {
    if (!to.isOnBoard()) return false;

    // Check if destination is empty
    if (getPiece(to)) return false;

    const jumpedCoord = getJumpedCoordinate(from.x, from.y, to.x, to.y);
    if (!jumpedCoord) return false;

    const jumpedPiece = getPiece(jumpedCoord);
    if (!jumpedPiece || jumpedPiece.color === piece.color) return false;

    return validMove(piece, from, to);
  };

  const getValidMoves = (coord: Coordinate): Move[] => {
    const piece = getPiece(coord);
    if (!piece) return [];

    const jumps = coord
      .getJumpTargets()
      .filter((target) => validJump(piece, coord, target))
      .map((target) => ({ from: coord, to: target }));

    const moves = coord
      .getMoveTargets()
      .filter((target) => validMove(piece, coord, target))
      .map((target) => ({ from: coord, to: target }));

    return [...jumps, ...moves];
  };

  const shouldCrown = (piece: GamePiece, to: Coordinate): boolean => {
    return (
      (to.y === 0 && piece.color === PieceColor.BLACK) ||
      (to.y === 7 && piece.color === PieceColor.WHITE)
    );
  };

  const makeMove = (from: Coordinate, to: Coordinate) => {
    const newBoard = [...state.board];
    const piece = getPiece(from);

    if (!piece) return;

    // Handle jumped piece
    const jumpedCoord = getJumpedCoordinate(from.x, from.y, to.x, to.y);
    if (jumpedCoord) {
      newBoard[jumpedCoord.x][jumpedCoord.y] = null;
    }

    // Move piece
    newBoard[to.x][to.y] = {
      ...piece,
      crowned: piece.crowned || shouldCrown(piece, to),
    };
    newBoard[from.x][from.y] = null;

    // Update state
    setState((prev) => ({
      ...prev,
      board: newBoard,
      currentTurn:
        prev.currentTurn.label === PieceColor.WHITE ? darkPlayer : lightPlayer,
      moveCount: prev.moveCount + 1,
    }));
  };

  const isValidMove = (from: Coordinate, to: Coordinate): boolean => {
    const piece = getPiece(from);
    if (!piece) return false;

    const validMoves = getValidMoves(from);
    return validMoves.some((move) => move.to.x === to.x && move.to.y === to.y);
  };

  const handlePieceClick = (x: number, y: number) => {
    const clickedCoord = new Coordinate(x, y);
    const piece = getPiece(clickedCoord);

    if (piece && piece.color === state.currentTurn.label) {
      setSelectedPiece(clickedCoord);
    } else if (selectedPiece && isValidMove(selectedPiece, clickedCoord)) {
      // Handle move logic here
      makeMove(selectedPiece, clickedCoord);
      setSelectedPiece(null);
    } else {
      setSelectedPiece(null);
    }
  };

  const initializePieces = () => {
    const newBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    [1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7].forEach((x, index) => {
      const y = Math.floor(index / 4);
      newBoard[x][y] = { color: PieceColor.WHITE, crowned: false };
    });

    [0, 2, 4, 6, 1, 3, 5, 7, 0, 2, 4, 6].forEach((x, index) => {
      const y = 5 + Math.floor(index / 4);
      newBoard[x][y] = { color: PieceColor.BLACK, crowned: false };
    });

    setState((prevState) => ({
      ...prevState,
      board: newBoard,
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[1.5rem] font-[800]"> Current Turn: {state.currentTurn.label}</p>
      <div className="flex ">
        {state.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col">
            {row.map((cell, columnIndex) => {
              return (
                <div
                  onClick={() => handlePieceClick(rowIndex, columnIndex)}
                  key={columnIndex}
                  className={`w-16 h-16 flex items-center justify-center cursor-pointer
                ${
                  (rowIndex + columnIndex) % 2 === 0
                    ? "bg-[#EDCC8F]"
                    : "bg-[#855E44]"
                }
                    `}
                >
                  {cell && (
                    <img
                      src={
                        cell.crowned
                          ? cell.color === PieceColor.BLACK
                            ? kingPieceImgDark
                            : kingPieceImgLight
                          : cell.color === PieceColor.BLACK
                          ? pieceImgDark
                          : pieceImgLight
                      }
                      alt={
                        cell.color === PieceColor.BLACK
                          ? "Black Piece"
                          : "White Piece"
                      }
                      className={`w-12 rounded-full   ${
                        isCellSelected(rowIndex, columnIndex)
                          ? "animate-scaling"
                          : ""
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameEngine;
