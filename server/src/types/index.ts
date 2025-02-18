import Coordinate from '../game/coordinate';
import { PlayerModel } from '../game/player';

export enum PieceColor {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
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
  current_turn: PlayerModel;
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
