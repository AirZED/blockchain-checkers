import pieceImgLight from "../../assets/white.png";
import pieceImgDark from "../../assets/black.png";
import { FigureNames, Labels } from "../../utils/contants";
import { CellModel } from "./Cell";

export class FigureModel {
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
    return this.cell.isForwardCell(targetCell, this);
  }

  validMove(from: CellModel, to: CellModel): boolean {
    if (!to.isOnBoard() || !from.isOnBoard()) {
      return false;
    }

    const { y: ty } = to;
    const { y: fy } = from;

    // if (this.cell.board[tx][ty]) {
    //     return false;
    // }

    let valid = false;
    if (
      ty > fy &&
      this.cell.figure?.label === Labels.Light &&
      !this.cell.figure?.isCrowned
    ) {
      valid = true;
    }

    if (
      ty < fy &&
      this.cell.figure?.label === Labels.Dark &&
      !this.cell.figure?.isCrowned
    ) {
      valid = true;
    }

    return valid;
  }
}
