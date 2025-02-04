import { useState, useEffect, ReactElement } from "react";
import { io, Socket } from "socket.io-client";
import pieceImgLight from "../../assets/white.png";
import pieceImgDark from "../../assets/black.png";
import kingPieceImgLight from "../../assets/whiteKing.png";
import kingPieceImgDark from "../../assets/blackKing.png";
import Coordinate from "./Coordinate";
import {
  GameEngineState,
  GamePiece,
  Move,
  PieceColor,
} from "../../utils/contants";

const GameEngine = (): ReactElement => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  const [gameStatus, setGameStatus] = useState<
    "waiting" | "playing" | "finished"
  >("waiting");
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<GameEngineState>({
    board: Array(8)
      .fill(null)
      .map(() => Array(8).fill(null)),
    currentTurn: PieceColor.WHITE,
    moveCount: 0,
  });

  const [selectedPiece, setSelectedPiece] = useState<Coordinate | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("roomCreated", ({ roomId, playerColor, gameState }) => {
      setRoomId(roomId);
      setPlayerColor(playerColor);
      setState(gameState);
      setGameStatus("waiting");
    });

    newSocket.on("gameJoined", ({ roomId, playerColor, gameState }) => {
      setRoomId(roomId);
      setPlayerColor(playerColor);
      setState(gameState);
    });

    newSocket.on("gameStart", ({ gameState }) => {
      setState(gameState);
      setGameStatus("playing");
    });

    newSocket.on("moveMade", ({ gameState, move }) => {
      setState(gameState);
      // Optional: Add move animation or highlighting
    });

    newSocket.on("playerDisconnected", ({ player }) => {
      setError(`${player} player disconnected`);
      setGameStatus("waiting");
    });

    newSocket.on("error", (message) => {
      setError(message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = () => {
    socket?.emit("createRoom");
  };

  const joinRoom = (roomId: string) => {
    socket?.emit("joinRoom", roomId);
  };

  const makeMove = (from: Coordinate, to: Coordinate) => {
    if (!roomId || state.currentTurn !== playerColor) return;

    socket?.emit("move", {
      roomId,
      move: { from, to },
    });
  };

  // ... (keep existing helper functions like getPiece, validMove, etc.)

  const handlePieceClick = (x: number, y: number) => {
    if (gameStatus !== "playing" || state.currentTurn !== playerColor) return;

    const clickedCoord = new Coordinate(x, y);
    const piece = getPiece(clickedCoord);

    if (piece && piece.color === playerColor) {
      setSelectedPiece(clickedCoord);
    } else if (selectedPiece && isValidMove(selectedPiece, clickedCoord)) {
      makeMove(selectedPiece, clickedCoord);
      setSelectedPiece(null);
    } else {
      setSelectedPiece(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!roomId ? (
        <div className="flex gap-4">
          <button
            onClick={createRoom}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Room
          </button>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Room ID"
              className="px-2 border rounded"
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              onClick={() => roomId && joinRoom(roomId)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-[1.5rem] font-[800]">
              Current Turn: {state.currentTurn}
            </p>
            <p className="text-[1.5rem] font-[800]">
              You are: {playerColor || "Spectator"}
            </p>
            <p className="text-[1rem]">Room ID: {roomId}</p>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {/* Existing board rendering code */}
        </>
      )}
    </div>
  );
};

export default GameEngine;
