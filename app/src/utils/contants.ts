import Coordinate from "../components/Engine/Coordinate";
import { PlayerModel } from "../components/Player/Player";

export enum PieceColor {
  BLACK = "BLACK",
  WHITE = "WHITE",
}

export type Move = {
  from: Coordinate;
  to: Coordinate;
};

export type GamePiece = {
  color: PieceColor;
  crowned: boolean;
};

export type GameEngineState = {
  board: (GamePiece | null)[][];
  currentTurn: PlayerModel;
  moveCount: number;
};

export enum Letters {
  Z,
  A,
  B,

  C,
  D,
  E,
  F,
  G,
  H,
}
