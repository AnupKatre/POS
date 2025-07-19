//! REST API endpoints for the POS application
//! 
//! This module provides HTTP endpoints for:
//! - Menu items management (CRUD operations)
//! - Orders management (create, update, fetch)
//! - Staff management (add, list, update)
//! - Analytics and reporting
//! - Application status and health
//! - Data synchronization

use axum::{
    routing::{get, post, put, delete},
    Router,
    extract::{State, Path, Json},
    http::StatusCode,
    response::Json as JsonResponse,
};
use tower_http::cors::CorsLayer;
use std::sync::Arc;
use serde::{Deserialize, Serialize};
use tracing::{info, error};

use crate::{AppState, db::{self, models::*}};

/// Start the REST API server
pub async fn start_server(app_state: Arc<AppState>) -> Result<(), Box<dyn std::error::Error>> {
    let cors = CorsLayer::permissive();
    
    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/menu", get(get_menu_items))
        .route("/api/menu", post(create_menu_item))
        .route("/api/menu/:id", get(get_menu_item))
        .route("/api/menu/:id", put(update_menu_item))
        .route("/api/menu/:id", delete(delete_menu_item))
        .route("/api/orders", get(get_orders))
        .route("/api/orders", post(create_order))
        .route("/api/orders/:id", get(get_order))
        .route("/api/orders/:id", put(update_order))
        .route("/api/staff", get(get_staff))
        .route("/api/staff", post(create_staff))
        .route("/api/staff/:id", put(update_staff))
        .route("/api/analytics", get(get_analytics))
        .route("/api/status", get(get_status))
        .route("/api/sync", post(sync_data))
        .layer(cors)
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001").await?;
    info!("REST API server started on http://127.0.0.1:3001");
    
    axum::serve(listener, app).await?;
    Ok(())
}

/// Health check endpoint
async fn health_check() -> JsonResponse<serde_json::Value> {
    JsonResponse(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

/// Get all menu items
async fn get_menu_items(
    State(state): State<Arc<AppState>>
) -> Result<JsonResponse<Vec<MenuItem>>, StatusCode> {
    match db::queries::get_menu_items(state.db.pool()).await {
        Ok(items) => Ok(JsonResponse(items)),
        Err(e) => {
            error!("Failed to get menu items: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Create a new menu item
async fn create_menu_item(
    State(state): State<Arc<AppState>>,
    Json(item): Json<CreateMenuItemRequest>
) -> Result<JsonResponse<MenuItem>, StatusCode> {
    let menu_item = MenuItem::new(
        item.name,
        item.description,
        item.price,
        item.category,
    );

    match db::queries::create_menu_item(state.db.pool(), &menu_item).await {
        Ok(_) => Ok(JsonResponse(menu_item)),
        Err(e) => {
            error!("Failed to create menu item: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get a specific menu item
async fn get_menu_item(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>
) -> Result<JsonResponse<MenuItem>, StatusCode> {
    match db::queries::get_menu_item(state.db.pool(), &id).await {
        Ok(Some(item)) => Ok(JsonResponse(item)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to get menu item: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Update a menu item
async fn update_menu_item(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(update): Json<UpdateMenuItemRequest>
) -> Result<JsonResponse<MenuItem>, StatusCode> {
    match db::queries::update_menu_item(state.db.pool(), &id, &update).await {
        Ok(Some(item)) => Ok(JsonResponse(item)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to update menu item: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Delete a menu item
async fn delete_menu_item(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>
) -> Result<StatusCode, StatusCode> {
    match db::queries::delete_menu_item(state.db.pool(), &id).await {
        Ok(true) => Ok(StatusCode::NO_CONTENT),
        Ok(false) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to delete menu item: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get all orders
async fn get_orders(
    State(state): State<Arc<AppState>>
) -> Result<JsonResponse<Vec<Order>>, StatusCode> {
    match db::queries::get_orders(state.db.pool()).await {
        Ok(orders) => Ok(JsonResponse(orders)),
        Err(e) => {
            error!("Failed to get orders: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Create a new order
async fn create_order(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateOrderRequest>
) -> Result<JsonResponse<Order>, StatusCode> {
    let order = Order::new(request.table_number, request.items);

    match db::queries::create_order(state.db.pool(), &order).await {
        Ok(_) => Ok(JsonResponse(order)),
        Err(e) => {
            error!("Failed to create order: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get a specific order
async fn get_order(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>
) -> Result<JsonResponse<Order>, StatusCode> {
    match db::queries::get_order(state.db.pool(), &id).await {
        Ok(Some(order)) => Ok(JsonResponse(order)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to get order: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Update an order
async fn update_order(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(update): Json<UpdateOrderRequest>
) -> Result<JsonResponse<Order>, StatusCode> {
    match db::queries::update_order(state.db.pool(), &id, &update).await {
        Ok(Some(order)) => Ok(JsonResponse(order)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to update order: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get all staff members
async fn get_staff(
    State(state): State<Arc<AppState>>
) -> Result<JsonResponse<Vec<Staff>>, StatusCode> {
    match db::queries::get_staff(state.db.pool()).await {
        Ok(staff) => Ok(JsonResponse(staff)),
        Err(e) => {
            error!("Failed to get staff: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Create a new staff member
async fn create_staff(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateStaffRequest>
) -> Result<JsonResponse<Staff>, StatusCode> {
    let staff = Staff::new(
        request.name,
        request.role,
        request.email,
        request.phone,
    );

    match db::queries::create_staff(state.db.pool(), &staff).await {
        Ok(_) => Ok(JsonResponse(staff)),
        Err(e) => {
            error!("Failed to create staff: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Update a staff member
async fn update_staff(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(update): Json<UpdateStaffRequest>
) -> Result<JsonResponse<Staff>, StatusCode> {
    match db::queries::update_staff(state.db.pool(), &id, &update).await {
        Ok(Some(staff)) => Ok(JsonResponse(staff)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to update staff: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get analytics summary
async fn get_analytics(
    State(state): State<Arc<AppState>>
) -> Result<JsonResponse<AnalyticsSummary>, StatusCode> {
    match db::queries::get_analytics_summary(state.db.pool()).await {
        Ok(analytics) => Ok(JsonResponse(analytics)),
        Err(e) => {
            error!("Failed to get analytics: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get application status
async fn get_status(
    State(state): State<Arc<AppState>>
) -> Result<JsonResponse<AppStatus>, StatusCode> {
    let sync_status = state.sync_service.get_status().await;
    
    Ok(JsonResponse(AppStatus {
        version: env!("CARGO_PKG_VERSION").to_string(),
        database_connected: true,
        last_sync: sync_status.last_sync_at,
        sync_status: sync_status.sync_status.to_string(),
        uptime: chrono::Utc::now().timestamp(),
    }))
}

/// Sync data with cloud
async fn sync_data(
    State(state): State<Arc<AppState>>
) -> Result<JsonResponse<SyncResult>, StatusCode> {
    match state.sync_service.sync_now().await {
        Ok(result) => Ok(JsonResponse(result)),
        Err(e) => {
            error!("Failed to sync data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

// Request/Response types

#[derive(Deserialize)]
pub struct CreateMenuItemRequest {
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub category: String,
}

#[derive(Deserialize)]
pub struct UpdateMenuItemRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<f64>,
    pub category: Option<String>,
    pub is_available: Option<bool>,
}

#[derive(Deserialize)]
pub struct CreateOrderRequest {
    pub table_number: i32,
    pub items: Vec<OrderItem>,
}

#[derive(Deserialize)]
pub struct UpdateOrderRequest {
    pub status: Option<OrderStatus>,
    pub total_amount: Option<f64>,
    pub items: Option<Vec<OrderItem>>,
}

#[derive(Deserialize)]
pub struct CreateStaffRequest {
    pub name: String,
    pub role: StaffRole,
    pub email: Option<String>,
    pub phone: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateStaffRequest {
    pub name: Option<String>,
    pub role: Option<StaffRole>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Serialize)]
pub struct AppStatus {
    pub version: String,
    pub database_connected: bool,
    pub last_sync: Option<chrono::DateTime<chrono::Utc>>,
    pub sync_status: String,
    pub uptime: i64,
}

#[derive(Serialize)]
pub struct SyncResult {
    pub success: bool,
    pub message: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
} 