//! POS Application - Tauri backend with embedded REST API
//! 
//! This application provides a desktop POS system with:
//! - Embedded REST API server for frontend communication
//! - SQLite database for local data storage
//! - Offline-first functionality with sync capabilities
//! - Cross-platform desktop support

mod api;
mod db;
mod services;
mod sync;
mod utils;
mod config;

use std::sync::Arc;
use tauri::Manager;
use tracing::{info, error};

/// Application state containing shared resources
pub struct AppState {
    pub db: Arc<db::Database>,
    pub sync_service: Arc<sync::SyncService>,
}

/// Main application entry point
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    tracing_subscriber::fmt::init();
    info!("Starting POS Application...");

    // Load configuration
    let config = config::Config::load()?;
    info!("Configuration loaded successfully");

    // Initialize database
    let db = Arc::new(db::Database::new(&config.database_url).await?);
    info!("Database initialized successfully");

    // Initialize sync service
    let sync_service = Arc::new(sync::SyncService::new(db.clone(), config.clone()));
    info!("Sync service initialized successfully");

    // Create application state
    let app_state = Arc::new(AppState {
        db,
        sync_service,
    });

    // Start REST API server in background
    let api_state = app_state.clone();
    tokio::spawn(async move {
        if let Err(e) = api::start_server(api_state).await {
            error!("Failed to start API server: {}", e);
        }
    });

    // Start sync service in background
    let sync_state = app_state.clone();
    tokio::spawn(async move {
        sync_state.sync_service.start().await;
    });

    // Run Tauri application
    tauri::Builder::default()
        .manage(app_state)
        .setup(|app| {
            info!("Tauri application setup complete");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
} 