import { PieceColor } from "../../utils/contants";

export class PlayerModel {
  label: PieceColor;

  constructor(label: PieceColor) {
    this.label = label;
  }
}
