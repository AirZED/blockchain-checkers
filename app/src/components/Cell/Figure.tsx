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
}
