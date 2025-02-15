use axum::{http, routing::get, Router};
use socketioxide::{extract::SocketRef, SocketIo};
use tokio::net::TcpListener;
use tower_http::cors::{CorsLayer, Origin};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create the Socket.io layer
    let (layer, io) = SocketIo::new_layer();

    // Register a handler for the default namespace
    io.ns("/", |socket: SocketRef| {
        println!("Client connected: {:?}", socket.id);

        socket.on("createRoom", |socket: SocketRef| {
            let room_id = 2;

            socket.join(roomId);

            socket.emit("roomCreated", room_id);
        });

        // Listen for "message" event
        socket.on("message", |socket: SocketRef| {
            socket.emit("message-back", "Hello World!").ok();
        });
    });

    let app = Router::new()
        .route("/", get(|| async { "Hello, Socket.io in Rust!" }))
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:5173".parse::<Origin>().unwrap())
                .allow_methods([http::Method::GET, http::Method::POST]),
        ) //allow cors for frontend
        .layer(layer);

    // Bind to a port and start the server
    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Server running on http://127.0.0.1:3000");
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
