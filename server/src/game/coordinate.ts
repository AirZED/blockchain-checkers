class Coordinate {
  constructor(public x: number, public y: number) {}

  isOnBoard(): boolean {
    const { x, y } = this;
    return x <= 7 && y <= 7 && x >= 0 && y >= 0;
  }

  getJumpTargets(): Coordinate[] {
    const jumps: Coordinate[] = [];
    const { x, y } = this;

    if (y >= 2) {
      if (x >= 2) {
        jumps.push(new Coordinate(x - 2, y - 2));
      }

      if (x <= 5) {
        jumps.push(new Coordinate(x + 2, y - 2));
      }
    }

    if (y <= 5) {
      if (x >= 2) {
        jumps.push(new Coordinate(x - 2, y + 2));
      }

      if (x <= 5) {
        jumps.push(new Coordinate(x + 2, y + 2));
      }
    }

    return jumps;
  }

  getMoveTargets(): Coordinate[] {
    const moves: Coordinate[] = [];
    const { x, y } = this;

    if (y >= 1) {
      if (x >= 1) {
        moves.push(new Coordinate(x - 1, y - 1));
      }

      if (x <= 6) {
        moves.push(new Coordinate(x + 1, y - 1));
      }
    }

    if (y <= 6) {
      if (x >= 1) {
        moves.push(new Coordinate(x - 1, y + 1));
      }

      if (x <= 6) {
        moves.push(new Coordinate(x + 1, y + 1));
      }
    }

    return moves;
  }
}
export default Coordinate;
