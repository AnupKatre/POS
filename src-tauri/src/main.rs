//! POS Application - Tauri Desktop App
//! 
//! A simple Tauri application that serves the Next.js frontend

use tauri::Manager;

/// Main application entry point
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            println!("POS Application started successfully!");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
} 