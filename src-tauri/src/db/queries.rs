//! Database queries for the POS application
//! 
//! This module contains all database operations including:
//! - Menu items CRUD operations
//! - Orders management queries
//! - Staff management queries
//! - Analytics and reporting queries
//! - Sync status queries

use sqlx::{sqlite::SqlitePool, Row};
use chrono::{DateTime, Utc};
use anyhow::Result;
use serde_json;

use super::models::*;

/// Menu Items Queries

/// Get all menu items
pub async fn get_menu_items(pool: &SqlitePool) -> Result<Vec<MenuItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, name, description, price, category, image_url, is_available, 
               created_at, updated_at
        FROM menu_items
        ORDER BY category, name
        "#
    )
    .fetch_all(pool)
    .await?;

    let mut items = Vec::new();
    for row in rows {
        items.push(MenuItem {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            price: row.get("price"),
            category: row.get("category"),
            image_url: row.get("image_url"),
            is_available: row.get("is_available"),
            created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
        });
    }
    Ok(items)
}

/// Get a specific menu item by ID
pub async fn get_menu_item(pool: &SqlitePool, id: &str) -> Result<Option<MenuItem>> {
    let row = sqlx::query(
        r#"
        SELECT id, name, description, price, category, image_url, is_available, 
               created_at, updated_at
        FROM menu_items
        WHERE id = ?
        "#
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    match row {
        Some(row) => Ok(Some(MenuItem {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            price: row.get("price"),
            category: row.get("category"),
            image_url: row.get("image_url"),
            is_available: row.get("is_available"),
            created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
        })),
        None => Ok(None),
    }
}

/// Create a new menu item
pub async fn create_menu_item(pool: &SqlitePool, item: &MenuItem) -> Result<()> {
    sqlx::query(
        r#"
        INSERT INTO menu_items (id, name, description, price, category, image_url, is_available, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&item.id)
    .bind(&item.name)
    .bind(&item.description)
    .bind(item.price)
    .bind(&item.category)
    .bind(&item.image_url)
    .bind(item.is_available)
    .bind(item.created_at.to_rfc3339())
    .bind(item.updated_at.to_rfc3339())
    .execute(pool)
    .await?;

    Ok(())
}

/// Update a menu item
pub async fn update_menu_item(
    pool: &SqlitePool, 
    id: &str, 
    update: &crate::api::UpdateMenuItemRequest
) -> Result<Option<MenuItem>> {
    let mut query = String::from("UPDATE menu_items SET updated_at = ?");
    let mut params: Vec<String> = vec![Utc::now().to_rfc3339()];

    if let Some(name) = &update.name {
        query.push_str(", name = ?");
        params.push(name.clone());
    }
    if let Some(description) = &update.description {
        query.push_str(", description = ?");
        params.push(description.clone());
    }
    if let Some(price) = update.price {
        query.push_str(", price = ?");
        params.push(price.to_string());
    }
    if let Some(category) = &update.category {
        query.push_str(", category = ?");
        params.push(category.clone());
    }
    if let Some(is_available) = update.is_available {
        query.push_str(", is_available = ?");
        params.push(is_available.to_string());
    }

    query.push_str(" WHERE id = ?");
    params.push(id.to_string());

    let result = sqlx::query(&query)
        .execute(pool)
        .await?;

    if result.rows_affected() > 0 {
        get_menu_item(pool, id).await
    } else {
        Ok(None)
    }
}

/// Delete a menu item
pub async fn delete_menu_item(pool: &SqlitePool, id: &str) -> Result<bool> {
    let result = sqlx::query("DELETE FROM menu_items WHERE id = ?")
        .bind(id)
        .execute(pool)
        .await?;

    Ok(result.rows_affected() > 0)
}

/// Orders Queries

/// Get all orders
pub async fn get_orders(pool: &SqlitePool) -> Result<Vec<Order>> {
    let rows = sqlx::query(
        r#"
        SELECT id, table_number, status, total_amount, items, created_at, updated_at
        FROM orders
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await?;

    let mut orders = Vec::new();
    for row in rows {
        orders.push(Order {
            id: row.get("id"),
            table_number: row.get("table_number"),
            status: serde_json::from_str(&row.get::<String, _>("status"))?,
            total_amount: row.get("total_amount"),
            items: row.get("items"),
            created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
        });
    }
    Ok(orders)
}

/// Get a specific order by ID
pub async fn get_order(pool: &SqlitePool, id: &str) -> Result<Option<Order>> {
    let row = sqlx::query(
        r#"
        SELECT id, table_number, status, total_amount, items, created_at, updated_at
        FROM orders
        WHERE id = ?
        "#
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    match row {
        Some(row) => Ok(Some(Order {
            id: row.get("id"),
            table_number: row.get("table_number"),
            status: serde_json::from_str(&row.get::<String, _>("status"))?,
            total_amount: row.get("total_amount"),
            items: row.get("items"),
            created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
        })),
        None => Ok(None),
    }
}

/// Create a new order
pub async fn create_order(pool: &SqlitePool, order: &Order) -> Result<()> {
    sqlx::query(
        r#"
        INSERT INTO orders (id, table_number, status, total_amount, items, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&order.id)
    .bind(order.table_number)
    .bind(serde_json::to_string(&order.status)?)
    .bind(order.total_amount)
    .bind(&order.items)
    .bind(order.created_at.to_rfc3339())
    .bind(order.updated_at.to_rfc3339())
    .execute(pool)
    .await?;

    Ok(())
}

/// Update an order
pub async fn update_order(
    pool: &SqlitePool, 
    id: &str, 
    update: &crate::api::UpdateOrderRequest
) -> Result<Option<Order>> {
    let mut query = String::from("UPDATE orders SET updated_at = ?");
    let mut params: Vec<String> = vec![Utc::now().to_rfc3339()];

    if let Some(status) = &update.status {
        query.push_str(", status = ?");
        params.push(serde_json::to_string(status)?);
    }
    if let Some(total_amount) = update.total_amount {
        query.push_str(", total_amount = ?");
        params.push(total_amount.to_string());
    }
    if let Some(items) = &update.items {
        query.push_str(", items = ?");
        params.push(serde_json::to_string(items)?);
    }

    query.push_str(" WHERE id = ?");
    params.push(id.to_string());

    let result = sqlx::query(&query)
        .execute(pool)
        .await?;

    if result.rows_affected() > 0 {
        get_order(pool, id).await
    } else {
        Ok(None)
    }
}

/// Staff Queries

/// Get all staff members
pub async fn get_staff(pool: &SqlitePool) -> Result<Vec<Staff>> {
    let rows = sqlx::query(
        r#"
        SELECT id, name, role, email, phone, is_active, created_at, updated_at
        FROM staff
        ORDER BY name
        "#
    )
    .fetch_all(pool)
    .await?;

    let mut staff = Vec::new();
    for row in rows {
        staff.push(Staff {
            id: row.get("id"),
            name: row.get("name"),
            role: serde_json::from_str(&row.get::<String, _>("role"))?,
            email: row.get("email"),
            phone: row.get("phone"),
            is_active: row.get("is_active"),
            created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
        });
    }
    Ok(staff)
}

/// Create a new staff member
pub async fn create_staff(pool: &SqlitePool, staff: &Staff) -> Result<()> {
    sqlx::query(
        r#"
        INSERT INTO staff (id, name, role, email, phone, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&staff.id)
    .bind(&staff.name)
    .bind(serde_json::to_string(&staff.role)?)
    .bind(&staff.email)
    .bind(&staff.phone)
    .bind(staff.is_active)
    .bind(staff.created_at.to_rfc3339())
    .bind(staff.updated_at.to_rfc3339())
    .execute(pool)
    .await?;

    Ok(())
}

/// Update a staff member
pub async fn update_staff(
    pool: &SqlitePool, 
    id: &str, 
    update: &crate::api::UpdateStaffRequest
) -> Result<Option<Staff>> {
    let mut query = String::from("UPDATE staff SET updated_at = ?");
    let mut params: Vec<String> = vec![Utc::now().to_rfc3339()];

    if let Some(name) = &update.name {
        query.push_str(", name = ?");
        params.push(name.clone());
    }
    if let Some(role) = &update.role {
        query.push_str(", role = ?");
        params.push(serde_json::to_string(role)?);
    }
    if let Some(email) = &update.email {
        query.push_str(", email = ?");
        params.push(email.clone());
    }
    if let Some(phone) = &update.phone {
        query.push_str(", phone = ?");
        params.push(phone.clone());
    }
    if let Some(is_active) = update.is_active {
        query.push_str(", is_active = ?");
        params.push(is_active.to_string());
    }

    query.push_str(" WHERE id = ?");
    params.push(id.to_string());

    let result = sqlx::query(&query)
        .execute(pool)
        .await?;

    if result.rows_affected() > 0 {
        // Get updated staff member
        let row = sqlx::query(
            r#"
            SELECT id, name, role, email, phone, is_active, created_at, updated_at
            FROM staff
            WHERE id = ?
            "#
        )
        .bind(id)
        .fetch_one(pool)
        .await?;

        Ok(Some(Staff {
            id: row.get("id"),
            name: row.get("name"),
            role: serde_json::from_str(&row.get::<String, _>("role"))?,
            email: row.get("email"),
            phone: row.get("phone"),
            is_active: row.get("is_active"),
            created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
        }))
    } else {
        Ok(None)
    }
}

/// Analytics Queries

/// Get analytics summary
pub async fn get_analytics_summary(pool: &SqlitePool) -> Result<AnalyticsSummary> {
    // Get total sales
    let total_sales: f64 = sqlx::query("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'Completed'")
        .fetch_one(pool)
        .await?
        .get(0);

    // Get total orders
    let total_orders: i64 = sqlx::query("SELECT COUNT(*) FROM orders")
        .fetch_one(pool)
        .await?
        .get(0);

    // Calculate average order value
    let average_order_value = if total_orders > 0 {
        total_sales / total_orders as f64
    } else {
        0.0
    };

    // Get active tables (tables with pending/confirmed/preparing orders)
    let active_tables: i64 = sqlx::query(
        "SELECT COUNT(DISTINCT table_number) FROM orders WHERE status IN ('Pending', 'Confirmed', 'Preparing')"
    )
    .fetch_one(pool)
    .await?
    .get(0);

    // Get staff on duty
    let staff_on_duty: i64 = sqlx::query("SELECT COUNT(*) FROM staff WHERE is_active = 1")
        .fetch_one(pool)
        .await?
        .get(0);

    Ok(AnalyticsSummary {
        total_sales,
        total_orders,
        average_order_value,
        active_tables,
        staff_on_duty,
    })
}

/// Sync Status Queries

/// Get current sync status
pub async fn get_sync_status(pool: &SqlitePool) -> Result<Option<SyncStatus>> {
    let row = sqlx::query(
        r#"
        SELECT id, last_sync_at, sync_status, error_message, created_at
        FROM sync_status
        ORDER BY created_at DESC
        LIMIT 1
        "#
    )
    .fetch_optional(pool)
    .await?;

    match row {
        Some(row) => Ok(Some(SyncStatus {
            id: row.get("id"),
            last_sync_at: row.get::<Option<String>, _>("last_sync_at")
                .map(|s| DateTime::parse_from_rfc3339(&s).unwrap().with_timezone(&Utc)),
            sync_status: serde_json::from_str(&row.get::<String, _>("sync_status"))?,
            error_message: row.get("error_message"),
            created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
        })),
        None => Ok(None),
    }
}

/// Update sync status
pub async fn update_sync_status(pool: &SqlitePool, status: &SyncStatus) -> Result<()> {
    sqlx::query(
        r#"
        INSERT INTO sync_status (last_sync_at, sync_status, error_message, created_at)
        VALUES (?, ?, ?, ?)
        "#
    )
    .bind(status.last_sync_at.map(|dt| dt.to_rfc3339()))
    .bind(serde_json::to_string(&status.sync_status)?)
    .bind(&status.error_message)
    .bind(status.created_at.to_rfc3339())
    .execute(pool)
    .await?;

    Ok(())
} 