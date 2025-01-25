import { useEffect, useState } from "react";
import { Board, BoardModel } from "./components/Board/Board";

function App() {
  const [board, setBoard] = useState<BoardModel>(new BoardModel());
  const restart = () => {
    const newBoard = new BoardModel();
    newBoard.createCells();
    setBoard(newBoard);
  };

  useEffect(() => {
    restart();
  }, []);

  return (
    <div className="app">
      <Board board={board} onSetBoard={setBoard} />
    </div>
  );
}

export default App;
