//! Database management for the POS application
//! 
//! This module handles SQLite database operations including:
//! - Database initialization and migrations
//! - Menu items management
//! - Orders management
//! - Staff management
//! - Analytics data

pub mod models;
pub mod queries;

use sqlx::{sqlite::SqlitePool, Row};
use tracing::{info, error};
use anyhow::Result;

/// Database connection and operations manager
pub struct Database {
    pool: SqlitePool,
}

impl Database {
    /// Create a new database connection
    pub async fn new(database_url: &str) -> Result<Self> {
        let pool = SqlitePool::connect(database_url).await?;
        let db = Self { pool };
        db.initialize().await?;
        Ok(db)
    }

    /// Initialize database schema
    async fn initialize(&self) -> Result<()> {
        info!("Initializing database schema...");
        
        // Create tables
        self.create_tables().await?;
        
        // Insert sample data if tables are empty
        self.insert_sample_data().await?;
        
        info!("Database initialization complete");
        Ok(())
    }

    /// Create database tables
    async fn create_tables(&self) -> Result<()> {
        // Menu items table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS menu_items (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                image_url TEXT,
                is_available BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            "#
        ).execute(&self.pool).await?;

        // Orders table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                table_number INTEGER NOT NULL,
                status TEXT NOT NULL,
                total_amount REAL NOT NULL,
                items TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            "#
        ).execute(&self.pool).await?;

        // Staff table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS staff (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            "#
        ).execute(&self.pool).await?;

        // Sync status table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS sync_status (
                id INTEGER PRIMARY KEY,
                last_sync_at DATETIME,
                sync_status TEXT DEFAULT 'pending',
                error_message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            "#
        ).execute(&self.pool).await?;

        Ok(())
    }

    /// Insert sample data for development
    async fn insert_sample_data(&self) -> Result<()> {
        // Check if menu items exist
        let count: i64 = sqlx::query("SELECT COUNT(*) FROM menu_items")
            .fetch_one(&self.pool)
            .await?
            .get(0);

        if count == 0 {
            info!("Inserting sample menu items...");
            
            let sample_items = vec![
                ("1", "Margherita Pizza", "Classic tomato and mozzarella", 12.99, "Pizza"),
                ("2", "Pepperoni Pizza", "Spicy pepperoni with cheese", 14.99, "Pizza"),
                ("3", "Caesar Salad", "Fresh romaine with caesar dressing", 8.99, "Salad"),
                ("4", "Chicken Wings", "Crispy wings with choice of sauce", 11.99, "Appetizer"),
                ("5", "Pasta Carbonara", "Creamy pasta with bacon", 13.99, "Pasta"),
            ];

            for (id, name, description, price, category) in sample_items {
                sqlx::query(
                    "INSERT INTO menu_items (id, name, description, price, category) VALUES (?, ?, ?, ?, ?)"
                )
                .bind(id)
                .bind(name)
                .bind(description)
                .bind(price)
                .bind(category)
                .execute(&self.pool)
                .await?;
            }
        }

        // Check if staff exist
        let count: i64 = sqlx::query("SELECT COUNT(*) FROM staff")
            .fetch_one(&self.pool)
            .await?
            .get(0);

        if count == 0 {
            info!("Inserting sample staff...");
            
            let sample_staff = vec![
                ("1", "John Doe", "Manager", "john@restaurant.com", "555-0101"),
                ("2", "Jane Smith", "Waiter", "jane@restaurant.com", "555-0102"),
                ("3", "Mike Johnson", "Chef", "mike@restaurant.com", "555-0103"),
            ];

            for (id, name, role, email, phone) in sample_staff {
                sqlx::query(
                    "INSERT INTO staff (id, name, role, email, phone) VALUES (?, ?, ?, ?, ?)"
                )
                .bind(id)
                .bind(name)
                .bind(role)
                .bind(email)
                .bind(phone)
                .execute(&self.pool)
                .await?;
            }
        }

        Ok(())
    }

    /// Get database pool reference
    pub fn pool(&self) -> &SqlitePool {
        &self.pool
    }
}

impl Drop for Database {
    fn drop(&mut self) {
        // Pool will be closed automatically
    }
} 