use std::{
    collections::HashMap,
    net::{Ipv4Addr, SocketAddrV4},
    sync::{Arc, Mutex},
};

use axum::{http::HeaderValue, routing::get};
use rand::Rng;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use tower_http::cors::{AllowOrigin, Any, CorsLayer};

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, PartialEq)]
enum PieceColor {
    WHITE,
    BLACK,
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

#[derive(Debug, Serialize, Clone, PartialEq, Copy)]
struct Player {
    label: PieceColor,
}

#[derive(Debug, Clone, PartialEq)]
struct Players {
    white: Option<String>,
    black: Option<String>,
}

#[derive(Debug, Serialize, Clone, PartialEq, Copy)]
struct GameState {
    board: [[Option<Piece>; 8]; 8],
    current_turn: Player,
    move_count: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Coordinate(pub usize, pub usize);

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
struct Movement {
    from: Coordinate,
    to: Coordinate,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
struct MovementSocket {
    room_id: String,
    movement: Movement,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (layer, io) = SocketIo::new_layer();
    let rooms = Arc::new(Mutex::new(HashMap::<String, GameRoom>::new()));

    io.ns("/", {
        let rooms = Arc::clone(&rooms);

        move |socket: SocketRef| {
            println!("Client connected: {:?}", socket.id);

            let rooms_create = Arc::clone(&rooms);
            socket.on("createRoom", move |socket: SocketRef| {
                let room_id = generate_room_id();
                let initial_state = create_initial_game_state();

                rooms_create.lock().unwrap().insert(
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
                            "playerColor": PieceColor::WHITE,
                            "gameState": initial_state
                        }),
                    )
                    .ok();
            });

            let rooms_join = Arc::clone(&rooms);
            socket.on(
                "joinRoom",
                move |socket: SocketRef, Data::<String>(room_id)| {
                    match rooms_join.lock().unwrap().get_mut(&room_id) {
                        Some(room) => match &room.players.black {
                            Some(_) => {
                                socket.emit("error", "Room is already full").ok();
                            }
                            None => {
                                room.players.black = Some(socket.id.to_string());
                                socket.join([room_id.to_owned()]);

                                let game_state = room.game_state.clone();
                                // drop(rooms); // Release the lock before the async operations

                                socket
                                    .emit(
                                        "gameJoined",
                                        &serde_json::json!({
                                            "roomId": room_id,
                                            "playerColor": PieceColor::WHITE,
                                            "gameState": game_state
                                        }),
                                    )
                                    .ok();

                                tokio::spawn(async move {
                                    socket
                                        .to(room_id)
                                        .emit(
                                            "gameStart",
                                            &serde_json::json!({
                                                "gameState": game_state
                                            }),
                                        )
                                        .await
                                        .ok();
                                });
                            }
                        },
                        None => {
                            socket.emit("error", "Room not found").ok();
                        }
                    }
                },
            );

            let rooms_move = Arc::clone(&rooms);
            socket.on(
                "move",
                move |socket: SocketRef, Data::<MovementSocket>(data)| {
                    match rooms_move.lock().unwrap().get_mut(&data.room_id) {
                        Some(room) => {}

                        None => {
                            socket.emit("error", "Room not found").ok();
                        }
                    };
                },
            );

            // Listen for "message" event
            socket.on("message", |socket: SocketRef| {
                socket.emit("message-back", "Hello World!").ok();
            });
        }
    });

    fn create_initial_game_state() -> GameState {
        let mut board: [[Option<Piece>; 8]; 8] = [[None; 8]; 8];

        // Set up white pieces
        let white_positions = [1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7];
        for (index, &x) in white_positions.iter().enumerate() {
            let y = index / 4;
            board[x][y] = Some(Piece {
                color: PieceColor::WHITE,
                crowned: false,
            });
        }

        // Set up black pieces
        let black_positions = [0, 2, 4, 6, 1, 3, 5, 7, 0, 2, 4, 6];
        for (index, &x) in black_positions.iter().enumerate() {
            let y = 5 + (index / 4);
            board[x][y] = Some(Piece {
                color: PieceColor::BLACK,
                crowned: false,
            });
        }

        GameState {
            board,
            current_turn: Player {
                label: PieceColor::WHITE,
            }, // White starts the game
            move_count: 0,
        }
    }

    fn should_crown(piece: &Piece, to: &Coordinate) -> bool {
        let Coordinate(_, y) = to;
        (*y == 0 && piece.color == PieceColor::BLACK)
            || (*y == 7 && piece.color == PieceColor::WHITE)
    }

    fn generate_room_id() -> String {
        let mut rng = rand::rng();
        const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
