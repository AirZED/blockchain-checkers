export type PlayerModel = {
  label: PieceColor;
};

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

export type GameState = {
  board: (GamePiece | null)[][];
  currentTurn: PlayerModel;
  moveCount: number;
};

export type Coordinate = {
  x: number;
  y: number;
};
