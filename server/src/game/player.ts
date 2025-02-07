import { PieceColor } from "../types";

export class PlayerModel {
  label: PieceColor;

  constructor(label: PieceColor) {
    this.label = label;
  }
}
