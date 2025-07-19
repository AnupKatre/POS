//! Business logic services for the POS application
//! 
//! This module contains business logic for:
//! - Order processing and validation
//! - Menu management
//! - Staff management
//! - Analytics and reporting

use anyhow::Result;
use chrono::{DateTime, Utc};

use crate::db::models::*;

/// Order processing service
pub struct OrderService;

impl OrderService {
    /// Validate an order before processing
    pub fn validate_order(order: &Order) -> Result<()> {
        if order.table_number <= 0 {
            return Err(anyhow::anyhow!("Invalid table number"));
        }

        if order.total_amount < 0.0 {
            return Err(anyhow::anyhow!("Invalid total amount"));
        }

        // Parse and validate order items
        let items: Vec<OrderItem> = serde_json::from_str(&order.items)?;
        if items.is_empty() {
            return Err(anyhow::anyhow!("Order must contain at least one item"));
        }

        for item in items {
            if item.quantity <= 0 {
                return Err(anyhow::anyhow!("Invalid quantity for item"));
            }
            if item.unit_price < 0.0 {
                return Err(anyhow::anyhow!("Invalid unit price for item"));
            }
        }

        Ok(())
    }

    /// Calculate order total from items
    pub fn calculate_total(items: &[OrderItem]) -> f64 {
        items.iter().map(|item| item.unit_price * item.quantity as f64).sum()
    }

    /// Check if order can be updated to a new status
    pub fn can_update_status(current: &OrderStatus, new: &OrderStatus) -> bool {
        match (current, new) {
            (OrderStatus::Pending, OrderStatus::Confirmed) => true,
            (OrderStatus::Confirmed, OrderStatus::Preparing) => true,
            (OrderStatus::Preparing, OrderStatus::Ready) => true,
            (OrderStatus::Ready, OrderStatus::Served) => true,
            (OrderStatus::Served, OrderStatus::Completed) => true,
            (_, OrderStatus::Cancelled) => true,
            _ => false,
        }
    }
}

/// Menu management service
pub struct MenuService;

impl MenuService {
    /// Validate menu item data
    pub fn validate_menu_item(item: &MenuItem) -> Result<()> {
        if item.name.trim().is_empty() {
            return Err(anyhow::anyhow!("Menu item name cannot be empty"));
        }

        if item.price < 0.0 {
            return Err(anyhow::anyhow!("Menu item price cannot be negative"));
        }

        if item.category.trim().is_empty() {
            return Err(anyhow::anyhow!("Menu item category cannot be empty"));
        }

        Ok(())
    }

    /// Get menu items by category
    pub fn filter_by_category(items: &[MenuItem], category: &str) -> Vec<MenuItem> {
        items.iter()
            .filter(|item| item.category == category && item.is_available)
            .cloned()
            .collect()
    }

    /// Search menu items by name
    pub fn search_by_name(items: &[MenuItem], query: &str) -> Vec<MenuItem> {
        let query = query.to_lowercase();
        items.iter()
            .filter(|item| item.name.to_lowercase().contains(&query) && item.is_available)
            .cloned()
            .collect()
    }
}

/// Staff management service
pub struct StaffService;

impl StaffService {
    /// Validate staff member data
    pub fn validate_staff(staff: &Staff) -> Result<()> {
        if staff.name.trim().is_empty() {
            return Err(anyhow::anyhow!("Staff name cannot be empty"));
        }

        if let Some(email) = &staff.email {
            if !email.contains('@') {
                return Err(anyhow::anyhow!("Invalid email format"));
            }
        }

        Ok(())
    }

    /// Get staff by role
    pub fn filter_by_role(staff: &[Staff], role: &StaffRole) -> Vec<Staff> {
        staff.iter()
            .filter(|s| std::mem::discriminant(&s.role) == std::mem::discriminant(role) && s.is_active)
            .cloned()
            .collect()
    }

    /// Get active staff count
    pub fn get_active_count(staff: &[Staff]) -> usize {
        staff.iter().filter(|s| s.is_active).count()
    }
}

/// Analytics service
pub struct AnalyticsService;

impl AnalyticsService {
    /// Calculate daily sales
    pub fn calculate_daily_sales(orders: &[Order], date: DateTime<Utc>) -> f64 {
        orders.iter()
            .filter(|order| {
                order.status == OrderStatus::Completed &&
                order.created_at.date_naive() == date.date_naive()
            })
            .map(|order| order.total_amount)
            .sum()
    }

    /// Calculate average order value
    pub fn calculate_average_order_value(orders: &[Order]) -> f64 {
        let completed_orders: Vec<&Order> = orders.iter()
            .filter(|order| order.status == OrderStatus::Completed)
            .collect();

        if completed_orders.is_empty() {
            return 0.0;
        }

        let total: f64 = completed_orders.iter().map(|order| order.total_amount).sum();
        total / completed_orders.len() as f64
    }

    /// Get top selling items
    pub fn get_top_selling_items(orders: &[Order], limit: usize) -> Vec<(String, i32)> {
        use std::collections::HashMap;

        let mut item_counts: HashMap<String, i32> = HashMap::new();

        for order in orders {
            if let Ok(items) = serde_json::from_str::<Vec<OrderItem>>(&order.items) {
                for item in items {
                    *item_counts.entry(item.menu_item_id).or_insert(0) += item.quantity;
                }
            }
        }

        let mut items: Vec<(String, i32)> = item_counts.into_iter().collect();
        items.sort_by(|a, b| b.1.cmp(&a.1));
        items.truncate(limit);
        items
    }
}

/// Table management service
pub struct TableService;

impl TableService {
    /// Get table status from orders
    pub fn get_table_status(orders: &[Order], table_number: i32) -> TableStatus {
        let active_orders: Vec<&Order> = orders.iter()
            .filter(|order| {
                order.table_number == table_number &&
                matches!(order.status, OrderStatus::Pending | OrderStatus::Confirmed | OrderStatus::Preparing | OrderStatus::Ready | OrderStatus::Served)
            })
            .collect();

        if active_orders.is_empty() {
            return TableStatus::Free;
        }

        // Find the most recent order
        let latest_order = active_orders.iter()
            .max_by_key(|order| order.created_at)
            .unwrap();

        match latest_order.status {
            OrderStatus::Pending | OrderStatus::Confirmed => TableStatus::Occupied,
            OrderStatus::Preparing | OrderStatus::Ready => TableStatus::Serving,
            OrderStatus::Served => TableStatus::Billing,
            _ => TableStatus::Free,
        }
    }

    /// Get all table statuses
    pub fn get_all_table_statuses(orders: &[Order], max_tables: i32) -> Vec<Table> {
        let mut tables = Vec::new();

        for table_number in 1..=max_tables {
            let status = Self::get_table_status(orders, table_number);
            let current_order_id = orders.iter()
                .filter(|order| {
                    order.table_number == table_number &&
                    matches!(order.status, OrderStatus::Pending | OrderStatus::Confirmed | OrderStatus::Preparing | OrderStatus::Ready | OrderStatus::Served)
                })
                .max_by_key(|order| order.created_at)
                .map(|order| order.id.clone());

            tables.push(Table {
                number: table_number,
                status,
                current_order_id,
                seats: 4, // Default seats, could be configurable
            });
        }

        tables
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_order_validation() {
        let valid_order = Order {
            id: "1".to_string(),
            table_number: 1,
            status: OrderStatus::Pending,
            total_amount: 25.0,
            items: serde_json::to_string(&vec![
                OrderItem {
                    menu_item_id: "1".to_string(),
                    quantity: 2,
                    unit_price: 12.5,
                    notes: None,
                }
            ]).unwrap(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        assert!(OrderService::validate_order(&valid_order).is_ok());
    }

    #[test]
    fn test_status_transition() {
        assert!(OrderService::can_update_status(&OrderStatus::Pending, &OrderStatus::Confirmed));
        assert!(OrderService::can_update_status(&OrderStatus::Confirmed, &OrderStatus::Preparing));
        assert!(!OrderService::can_update_status(&OrderStatus::Completed, &OrderStatus::Preparing));
    }

    #[test]
    fn test_calculate_total() {
        let items = vec![
            OrderItem {
                menu_item_id: "1".to_string(),
                quantity: 2,
                unit_price: 10.0,
                notes: None,
            },
            OrderItem {
                menu_item_id: "2".to_string(),
                quantity: 1,
                unit_price: 5.0,
                notes: None,
            },
        ];

        assert_eq!(OrderService::calculate_total(&items), 25.0);
    }
} 