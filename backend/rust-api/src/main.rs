mod handlers;
mod models;

use axum::{routing::get, Router, serve};
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/items", get(handlers::get_items));

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("Listening on {}", addr);

    let listener = TcpListener::bind(addr).await.unwrap();
    serve(listener, app.into_make_service()).await.unwrap();
}