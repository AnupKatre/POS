//! Database models for the POS application
//! 
//! This module defines the data structures used throughout the application
//! including menu items, orders, staff, and sync status.

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Menu item model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MenuItem {
    /// Unique identifier for the menu item
    pub id: String,
    /// Name of the menu item
    pub name: String,
    /// Description of the menu item
    pub description: Option<String>,
    /// Price of the menu item
    pub price: f64,
    /// Category of the menu item (e.g., "Pizza", "Salad", "Appetizer")
    pub category: String,
    /// URL to the item's image
    pub image_url: Option<String>,
    /// Whether the item is available for ordering
    pub is_available: bool,
    /// When the item was created
    pub created_at: DateTime<Utc>,
    /// When the item was last updated
    pub updated_at: DateTime<Utc>,
}

/// Order item within an order
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrderItem {
    /// Menu item ID
    pub menu_item_id: String,
    /// Quantity ordered
    pub quantity: i32,
    /// Price per unit
    pub unit_price: f64,
    /// Special instructions
    pub notes: Option<String>,
}

/// Order model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    /// Unique identifier for the order
    pub id: String,
    /// Table number where the order was placed
    pub table_number: i32,
    /// Current status of the order
    pub status: OrderStatus,
    /// Total amount of the order
    pub total_amount: f64,
    /// Items in the order (JSON string)
    pub items: String,
    /// When the order was created
    pub created_at: DateTime<Utc>,
    /// When the order was last updated
    pub updated_at: DateTime<Utc>,
}

/// Order status enumeration
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum OrderStatus {
    /// Order has been placed but not yet confirmed
    Pending,
    /// Order has been confirmed and is being prepared
    Confirmed,
    /// Order is being prepared in the kitchen
    Preparing,
    /// Order is ready for serving
    Ready,
    /// Order has been served to the customer
    Served,
    /// Order has been completed and paid
    Completed,
    /// Order has been cancelled
    Cancelled,
}

impl std::fmt::Display for OrderStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OrderStatus::Pending => write!(f, "Pending"),
            OrderStatus::Confirmed => write!(f, "Confirmed"),
            OrderStatus::Preparing => write!(f, "Preparing"),
            OrderStatus::Ready => write!(f, "Ready"),
            OrderStatus::Served => write!(f, "Served"),
            OrderStatus::Completed => write!(f, "Completed"),
            OrderStatus::Cancelled => write!(f, "Cancelled"),
        }
    }
}

/// Staff member model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Staff {
    /// Unique identifier for the staff member
    pub id: String,
    /// Full name of the staff member
    pub name: String,
    /// Role of the staff member
    pub role: StaffRole,
    /// Email address
    pub email: Option<String>,
    /// Phone number
    pub phone: Option<String>,
    /// Whether the staff member is active
    pub is_active: bool,
    /// When the staff member was added
    pub created_at: DateTime<Utc>,
    /// When the staff member was last updated
    pub updated_at: DateTime<Utc>,
}

/// Staff role enumeration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum StaffRole {
    /// Restaurant manager
    Manager,
    /// Waiter/waitress
    Waiter,
    /// Kitchen staff
    Chef,
    /// Cashier
    Cashier,
    /// Host/hostess
    Host,
}

impl std::fmt::Display for StaffRole {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            StaffRole::Manager => write!(f, "Manager"),
            StaffRole::Waiter => write!(f, "Waiter"),
            StaffRole::Chef => write!(f, "Chef"),
            StaffRole::Cashier => write!(f, "Cashier"),
            StaffRole::Host => write!(f, "Host"),
        }
    }
}

/// Sync status model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncStatus {
    /// Unique identifier
    pub id: i32,
    /// When the last sync occurred
    pub last_sync_at: Option<DateTime<Utc>>,
    /// Current sync status
    pub sync_status: SyncStatusType,
    /// Error message if sync failed
    pub error_message: Option<String>,
    /// When this record was created
    pub created_at: DateTime<Utc>,
}

/// Sync status type enumeration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SyncStatusType {
    /// Sync is pending
    Pending,
    /// Sync is in progress
    InProgress,
    /// Sync completed successfully
    Completed,
    /// Sync failed
    Failed,
}

impl std::fmt::Display for SyncStatusType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SyncStatusType::Pending => write!(f, "Pending"),
            SyncStatusType::InProgress => write!(f, "In Progress"),
            SyncStatusType::Completed => write!(f, "Completed"),
            SyncStatusType::Failed => write!(f, "Failed"),
        }
    }
}

/// Analytics summary model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalyticsSummary {
    /// Total sales for the period
    pub total_sales: f64,
    /// Number of orders
    pub total_orders: i64,
    /// Average order value
    pub average_order_value: f64,
    /// Number of active tables
    pub active_tables: i64,
    /// Number of staff on duty
    pub staff_on_duty: i64,
}

/// Table status model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Table {
    /// Table number
    pub number: i32,
    /// Current status of the table
    pub status: TableStatus,
    /// Current order ID if occupied
    pub current_order_id: Option<String>,
    /// Number of seats
    pub seats: i32,
}

/// Table status enumeration
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TableStatus {
    /// Table is free and available
    Free,
    /// Table is occupied by customers
    Occupied,
    /// Table is being served
    Serving,
    /// Table is in billing process
    Billing,
}

impl std::fmt::Display for TableStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TableStatus::Free => write!(f, "Free"),
            TableStatus::Occupied => write!(f, "Occupied"),
            TableStatus::Serving => write!(f, "Serving"),
            TableStatus::Billing => write!(f, "Billing"),
        }
    }
}

/// Utility functions for models
impl MenuItem {
    /// Create a new menu item with generated ID
    pub fn new(name: String, description: Option<String>, price: f64, category: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            price,
            category,
            image_url: None,
            is_available: true,
            created_at: now,
            updated_at: now,
        }
    }
}

impl Order {
    /// Create a new order with generated ID
    pub fn new(table_number: i32, items: Vec<OrderItem>) -> Self {
        let now = Utc::now();
        let total_amount = items.iter().map(|item| item.unit_price * item.quantity as f64).sum();
        let items_json = serde_json::to_string(&items).unwrap_or_default();
        
        Self {
            id: Uuid::new_v4().to_string(),
            table_number,
            status: OrderStatus::Pending,
            total_amount,
            items: items_json,
            created_at: now,
            updated_at: now,
        }
    }
}

impl Staff {
    /// Create a new staff member with generated ID
    pub fn new(name: String, role: StaffRole, email: Option<String>, phone: Option<String>) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            role,
            email,
            phone,
            is_active: true,
            created_at: now,
            updated_at: now,
        }
    }
} 