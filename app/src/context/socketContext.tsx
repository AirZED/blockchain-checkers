import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { socket } from "../utils/socket";
import { GameEngineState, PieceColor } from "../utils/contants";
import { Provider, Wallet } from "@coral-xyz/anchor";
import { makeProvider } from "../utils/provider/setup";
export class PlayerModel {
    label: PieceColor;

    constructor(label: PieceColor) {
        this.label = label;
    }
}

interface SocketContextType {
    roomId: string | null;
    playerColor: PlayerModel | null;
    gameStatus: "waiting" | "playing" | "finished";
    state: GameEngineState;
    error: string | null;
    createRoom: () => void;
    joinRoom: (roomId: string) => void;
    provider: Provider | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "finished">("waiting");
    const [error, setError] = useState<string | null>(null);
    const [playerColor, setPlayerColor] = useState<PlayerModel | null>(null);
    const [provider, setProvider] = useState<Provider | null>(null);

    const lightPlayer = new PlayerModel(PieceColor.WHITE);
    // const darkPlayer = new PlayerModel(PieceColor.BLACK);

    const [state, setState] = useState<GameEngineState>({
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        current_turn: lightPlayer,
        moveCount: 0,
    });

    useEffect(() => {

        const { solana } = window as any;
        if (!solana) {
            alert("Solana object not found");
            return;
        }
        setProvider(makeProvider((window as any).solana as Wallet))
    }, [])

    useEffect(() => {
        socket.connect();

        socket.on("roomCreated", ({ roomId, playerColor, gameState }) => {
            setRoomId(roomId);
            setPlayerColor(new PlayerModel(playerColor));
            setState(gameState);
            setGameStatus("waiting");
        });

        socket.on("gameJoined", ({ roomId, playerColor, gameState }) => {
            console.log("Joined room:", roomId);
            setRoomId(roomId);
            setPlayerColor(new PlayerModel(playerColor));
            setState(gameState);
        });

        socket.on("gameStart", ({ gameState }) => {
            console.log("Game starting");
            setState(gameState);
            setGameStatus("playing");
        });

        socket.on("moveMade", ({ gameState }) => {
            setState(gameState);
        });

        socket.on("playerDisconnected", ({ player }) => {
            setError(`${player} player disconnected`);
            setGameStatus("waiting");
        });

        socket.on("error", (message) => {
            setError(message);
        });

        return () => {
            socket.close();
        };
    }, []);


    const createRoom = () => {
        socket.emit("createRoom");
    };

    const joinRoom = (roomId: string) => {
        socket.emit("joinRoom", roomId);
    };

    return (
        <SocketContext.Provider value={{ roomId, playerColor, gameStatus, state, error, createRoom, joinRoom, provider }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
