import { useEffect, useState } from "react";
import { PlayerModel } from "./components/Player/Player";
import GameEngine from "./components/Engine/GameEngine";

function App() {
  // const [board, setBoard] = useState<BoardModel>(new BoardModel());
  // const lightPlayer = new PlayerModel(Labels.Light);
  // const darkPlayer = new PlayerModel(Labels.Dark);
  // const [currentPlayer, setCurrentPlayer] = useState<PlayerModel>(lightPlayer);

  // const restart = () => {
  //   const newBoard = new BoardModel();
  //   newBoard.createCells();
  //   newBoard.addFigures();
  //   setBoard(newBoard);
  // };

  // useEffect(() => {
  //   restart();
  // }, []);

  // const changePlayer = () => {
  //   setCurrentPlayer(
  //     currentPlayer?.label === Labels.Light ? darkPlayer : lightPlayer
  //   );
  // };

  return (
    <div className="app w-screen h-screen flex justify-center items-center flex-col gap-24">
      {/* <div className="player">Current Player: {currentPlayer.label}</div> */}

      <GameEngine />
    </div>
  );
}

export default App;
