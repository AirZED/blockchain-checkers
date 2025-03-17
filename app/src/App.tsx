import GameEngine from "./components/Engine/GameEngine";
import { Route, Routes } from "react-router-dom";
import CreateGame from "./pages/CreateGame";
import JoinGame from "./pages/JoinGame";
import Nav from "./components/Nav";

function App() {
  return (
    <div className={`gap-4 bg-purple-900 h-screen bg-[url("../src/assets/bg.jpeg")] bg-black bg-blend-multiply w-full bg-cover bg-center bg-no-repeat`}>
      <Nav />


      <Routes>
        <Route path="/" element={<GameEngine />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="join-game" element={<JoinGame />} />
        <Route path="/claim-rewards" element={<GameEngine />} />
      </Routes>
    </div>
  );
}

export default App;
