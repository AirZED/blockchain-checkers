// https://github.com/Totodore/socketioxide/blob/main/examples/axum-echo-tls/axum_echo-tls.rs

use std::{
    net::{Ipv4Addr, SocketAddrV4},
    vec,
};

use axum::{http::HeaderValue, routing::get};
use rand::Rng;
use socketioxide::{extract::SocketRef, SocketIo};
use tower_http::cors::{AllowOrigin, Any, CorsLayer};

use serde::Serialize;

#[derive(Debug, Clone, Copy, Serialize, PartialEq)]
enum PieceColor {
    White,
    Black,
}

#[derive(Debug, Clone, Copy, Serialize)]
struct Piece {
    color: PieceColor,
    crowned: bool,
}

#[derive(Debug, Serialize, Clone)]
struct GameState {
    board: [[Option<Piece>; 8]; 8],
    current_turn: PieceColor,
    move_count: u32,
}

#[derive(Debug, Clone)]
struct GameRoom {
    id: String,
    players: Players,
    game_state: GameState,
}

#[derive(Debug, Clone)]
struct Players {
    white: Option<String>,
    black: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Coordinate(pub usize, pub usize);

struct Move {
    from: Coordinate,
    to: Coordinate,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (layer, io) = SocketIo::new_layer();

    io.ns("/", |socket: SocketRef| {
        println!("Client connected: {:?}", socket.id);
        let mut rooms: Vec<GameRoom> = vec![];

        socket.on("createRoom", move |socket: SocketRef| {
            let room_id = generate_room_id();
            let initial_state = create_initial_game_state();

            rooms.push(GameRoom {
                id: room_id.to_owned(),
                players: Players {
                    white: Some(socket.id.to_string()),
                    black: None,
                },
                game_state: initial_state.clone(),
            });

            socket.join(room_id.to_owned());
            socket
                .emit(
                    "roomCreated",
                    &serde_json::json!({
                        "roomId": room_id,
                        "playerColor": PieceColor::White,
                        "gameState": initial_state
                    }),
                )
                .ok();
        });

        socket.on("joinRoom", move |roomId: &str| {
            let room = rooms.iter().find(|room: &GameRoom| room.id == roomId);
        });

        // Listen for "message" event
        socket.on("message", |socket: SocketRef| {
            socket.emit("message-back", "Hello World!").ok();
        });
    });

    fn create_initial_game_state() -> GameState {
        let mut board: [[Option<Piece>; 8]; 8] = [[None; 8]; 8];

        // Set up white pieces
        let white_positions = [1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7];
        for (index, &x) in white_positions.iter().enumerate() {
            let y = index / 4;
            board[x][y] = Some(Piece {
                color: PieceColor::White,
                crowned: false,
            });
        }

        // Set up black pieces
        let black_positions = [0, 2, 4, 6, 1, 3, 5, 7, 0, 2, 4, 6];
        for (index, &x) in black_positions.iter().enumerate() {
            let y = 5 + (index / 4);
            board[x][y] = Some(Piece {
                color: PieceColor::Black,
                crowned: false,
            });
        }

        GameState {
            board,
            current_turn: PieceColor::White, // White starts the game
            move_count: 0,
        }
    }

    fn should_crown(piece: &Piece, to: &Coordinate) -> bool {
        let Coordinate(_, y) = to;
        (*y == 0 && piece.color == PieceColor::Black)
            || (*y == 7 && piece.color == PieceColor::White)
    }

    fn generate_room_id() -> String {
        let characters: Vec<char> =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                .chars()
                .collect();
        let mut random_number = rand::rng();

        (0..6)
            .map(|_| characters[random_number.random_range(0..characters.len())])
            .collect()
    }

    let app = axum::Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .layer(layer)
        .layer(
            CorsLayer::new()
                .allow_origin(AllowOrigin::exact(
                    "http://localhost:5173".parse::<HeaderValue>().unwrap(),
                    // "https://your-production-domain.com".parse::<HeaderValue>().unwrap()
                ))
                .allow_methods(Any),
        );

    let socket_address = SocketAddrV4::new(Ipv4Addr::UNSPECIFIED, 3000);
    let listener = tokio::net::TcpListener::bind(socket_address).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
