// server.ts
import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import { GameState, Move, PieceColor, PlayerModel } from './types';

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
  gameState: GameState;
}

class GameServer {
  private rooms: Map<string, GameRoom> = new Map();

  constructor() {
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('createRoom', () => {
        const roomId = this.createRoom(socket.id);
        socket.join(roomId);
        socket.emit('roomCreated', {
          roomId,
          playerColor: PieceColor.WHITE,
          gameState: this.rooms.get(roomId)?.gameState,
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

        room.players.black = socket.id;
        socket.join(roomId);

        // Notify both players
        socket.emit('gameJoined', {
          roomId,
          playerColor: PieceColor.BLACK,
          gameState: room.gameState,
        });

        io.to(roomId).emit('gameStart', { gameState: room.gameState });
      });

      socket.on('move', ({ roomId, move }: { roomId: string; move: Move }) => {
        const room = this.rooms.get(roomId);
        if (!room) return;

        // Validate move and update game state
        const newState = this.processMove(room.gameState, move);
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

  private createRoom(playerId: string): string {
    const roomId = Math.random().toString(36).substring(7);
    this.rooms.set(roomId, {
      id: roomId,
      players: { white: playerId },
      gameState: this.createInitialGameState(),
    });
    return roomId;
  }

  private createInitialGameState(): GameState {
    // Initialize game state similar to your current implementation
    return {
      board: Array(8)
        .fill(null)
        .map(() => Array(8).fill(null)),
      currentTurn: { label: PieceColor.WHITE },
      moveCount: 0,
    };
  }

  private processMove(gameState: GameState, move: Move): GameState {
    // Implement move processing logic
    // Return updated game state
    return gameState;
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
