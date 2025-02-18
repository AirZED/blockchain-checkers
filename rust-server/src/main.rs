// https://github.com/Totodore/socketioxide/blob/main/examples/axum-echo-tls/axum_echo-tls.rs

use std::{
    collections::HashMap,
    net::{Ipv4Addr, SocketAddrV4},
    sync::{Arc, Mutex},
    vec,
};

use axum::{http::HeaderValue, routing::get};
use rand::Rng;
use socketioxide::{
    extract::{Data, SocketRef},
    handler::Value,
    SocketIo,
};
use tower_http::cors::{AllowOrigin, Any, CorsLayer};

use serde::{de::value, Serialize};

#[derive(Debug, Clone, Copy, Serialize, PartialEq)]
enum PieceColor {
    White,
    Black,
}

#[derive(Debug, Clone, Copy, Serialize, PartialEq)]
struct Piece {
    color: PieceColor,
    crowned: bool,
}

#[derive(Debug, Clone, PartialEq)]
struct GameRoom {
    players: Players,
    game_state: GameState,
}

#[derive(Debug, Clone, PartialEq)]
struct Players {
    white: Option<String>,
    black: Option<String>,
}

#[derive(Debug, Serialize, Clone, PartialEq, Copy)]
struct GameState {
    board: [[Option<Piece>; 8]; 8],
    current_turn: PieceColor,
    move_count: u32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Coordinate(pub usize, pub usize);

#[derive(Debug, Clone, Copy, PartialEq)]
struct Move {
    from: Coordinate,
    to: Coordinate,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // let rooms = Vec::<GameRoom>::new();
    let mut rooms = HashMap::<String, GameRoom>::new();
    let (layer, io) = SocketIo::new_layer();

    io.ns("/", |socket: SocketRef| {
        println!("Client connected: {:?}", socket.id);

        let rooms_inside = &mut rooms;

        socket.on("createRoom", move |socket: SocketRef| {
            let room_id = generate_room_id();
            let initial_state = create_initial_game_state();

            rooms.insert(
                room_id.to_owned(),
                GameRoom {
                    players: Players {
                        white: Some(socket.id.to_string()),
                        black: None,
                    },
                    game_state: initial_state.clone(),
                },
            );

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

        socket.on(
            "joinRoom",
            move |socket: SocketRef, Data::<String>(room_id)| async move {
                // let room = rooms.iter_mut().find(|room| room.id == room_id);

                match rooms.get_mut(&room_id) {
                    Some(room) => match &room.players.black {
                        Some(_) => {
                            socket.emit("error", "Room is already full").ok();
                        }
                        None => {
                            room.players.black = Some(socket.id.as_str());
                            socket.join([room_id.to_owned()]);

                            socket
                                .emit(
                                    "gameJoined",
                                    &serde_json::json!({
                                        "roomId": room_id,
                                        "playerColor": PieceColor::White,
                                        "gameState": room.game_state
                                    }),
                                )
                                .ok();

                            io.to(room_id)
                                .emit(
                                    "gameStart",
                                    &serde_json::json!({
                            "gameState": room.game_state}),
                                )
                                .await
                                .ok();
                        }
                    },
                    None => {
                        socket.emit("error", "Room not found").ok();
                    }
                }
            },
        );
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
        let mut rng = rand::rng();
        const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        (0..6)
            .map(|_| {
                let idx = rng.random_range(0..CHARSET.len());
                CHARSET[idx] as char
            })
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
