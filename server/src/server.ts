import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import { GameEngineState, Move, PieceColor } from './types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST'],
  },
});

interface GameRoom {
  id: string;
  players: {
    white?: string;
    black?: string;
  };
  gameState: GameEngineState;
}

class GameServer {
  private rooms: Map<string, GameRoom> = new Map();

  constructor() {
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('createRoom', () => {
        const roomId = this.generateRoomId();
        const initialState = this.createInitialGameState();

        this.rooms.set(roomId, {
          id: roomId,
          players: { white: socket.id },
          gameState: initialState,
        });

        socket.join(roomId);
        socket.emit('roomCreated', {
          roomId,
          playerColor: PieceColor.WHITE,
          gameState: initialState,
        });
      });

      socket.on('joinRoom', (roomId: string) => {
        const room = this.rooms.get(roomId);

        if (!room) {
          socket.emit('error', 'Room not found');
          return;
        }

        if (room.players.black) {
          socket.emit('error', 'Room is full');
          return;
        }

        // Add second player
        room.players.black = socket.id;
        socket.join(roomId);

        // Notify the joining player
        socket.emit('gameJoined', {
          roomId,
          playerColor: PieceColor.BLACK,
          gameState: room.gameState,
        });

        // Start the game for both players
        io.to(roomId).emit('gameStart', {
          gameState: room.gameState,
        });
      });

      socket.on('move', ({ roomId, move }: { roomId: string; move: Move }) => {
        const room = this.rooms.get(roomId);
        if (!room) return;

        // Validate move and update game state
        const newState = this.processMove(room.gameState, move);

        console.log('New state:', newState);
        room.gameState = newState;

        // Broadcast the move to all players in the room
        io.to(roomId).emit('moveMade', {
          gameState: newState,
          move,
        });
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket.id);
      });
    });
  }

  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  // private createRoom(playerId: string): string {
  //   const roomId = Math.random().toString(36).substring(7);
  //   this.rooms.set(roomId, {
  //     id: roomId,g
  //     players: { white: playerId },
  //     gameState: this.createInitialGameState(),
  //   });
  //   return roomId;
  // }

  private createInitialGameState(): GameEngineState {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Set up white pieces
    [1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7].forEach((x, index) => {
      const y = Math.floor(index / 4);
      board[x][y] = { color: PieceColor.WHITE, crowned: false };
    });

    // Set up black pieces
    [0, 2, 4, 6, 1, 3, 5, 7, 0, 2, 4, 6].forEach((x, index) => {
      const y = 5 + Math.floor(index / 4);
      board[x][y] = { color: PieceColor.BLACK, crowned: false };
    });

    return {
      board,
      currentTurn: { label: PieceColor.WHITE },
      moveCount: 0,
    };
  }

  private processMove(gameState: GameEngineState, move: Move): GameEngineState {
    console.log('Processing move:', move);
    console.log('Current game state:', gameState);
    const newBoard = JSON.parse(JSON.stringify(gameState.board));

    console.log('newBoard', newBoard);
    const piece = newBoard[move.from.x][move.from.y];

    // Handle the jumped piece
    const jumpedX = Math.floor((move.from.x + move.to.x) / 2);
    const jumpedY = Math.floor((move.from.y + move.to.y) / 2);

    if (Math.abs(move.to.x - move.from.x) >= 2) {
      newBoard[jumpedX][jumpedY] = null;
    }

    // Move piece
    newBoard[move.to.x][move.to.y] = {
      ...piece,
      crowned:
        piece.crowned ||
        (piece.color === PieceColor.WHITE && move.to.y === 7) ||
        (piece.color === PieceColor.BLACK && move.to.y === 0),
    };
    newBoard[move.from.x][move.from.y] = null;

    return {
      board: newBoard,
      currentTurn:
        gameState.currentTurn.label === PieceColor.WHITE
          ? { label: PieceColor.BLACK }
          : { label: PieceColor.WHITE },
      moveCount: gameState.moveCount + 1,
    };
  }

  private handleDisconnect(socketId: string) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.players.white === socketId || room.players.black === socketId) {
        io.to(roomId).emit('playerDisconnected', {
          player: room.players.white === socketId ? 'white' : 'black',
        });

        // Remove room if both players are gone
        if (!room.players.white && !room.players.black) {
          this.rooms.delete(roomId);
        }
      }
    }
  }

  public start(port: number) {
    httpServer.listen(port, () => {
      console.log(`Game server running on port ${port}`);
    });
  }
}

new GameServer().start(3000);
