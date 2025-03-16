import GameEngine from "./components/Engine/GameEngine";
import { Route, Routes } from "react-router-dom";
import CreateGame from "./pages/CreateGame";

function App() {
  return (
    <div className="app w-screen h-screen flex justify-center items-center flex-col gap-24">
      {/* <div className="player">Current Player: {currentPlayer.label}</div> */}



      <Routes>
        <Route path="/" element={<GameEngine />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/game" element={<GameEngine />} />
      </Routes>
      <GameEngine />
    </div>
  );
}

export default App;
