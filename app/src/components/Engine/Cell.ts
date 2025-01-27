import Coordinate from "./Coordinate";
import { GamePiece } from "./GameEngine";

export class Cell {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public piece: GamePiece | null = null
  ) {}

  isEmpty(): boolean {
    return this.piece === null;
  }

  isSelected(selectedCoord: Coordinate | null): boolean {
    if (!selectedCoord) return false;
    return selectedCoord.x === this.x && selectedCoord.y === this.y;
  }
}
