//! Utility functions for the POS application
//! 
//! This module contains helper functions for:
//! - Data formatting and validation
//! - Error handling
//! - Common operations

use std::collections::HashMap;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// Format currency values
pub fn format_currency(amount: f64) -> String {
    format!("${:.2}", amount)
}

/// Format date and time
pub fn format_datetime(dt: &DateTime<Utc>) -> String {
    dt.format("%Y-%m-%d %H:%M:%S").to_string()
}

/// Format date only
pub fn format_date(dt: &DateTime<Utc>) -> String {
    dt.format("%Y-%m-%d").to_string()
}

/// Generate a unique ID
pub fn generate_id() -> String {
    uuid::Uuid::new_v4().to_string()
}

/// Validate email format
pub fn is_valid_email(email: &str) -> bool {
    use regex::Regex;
    lazy_static::lazy_static! {
        static ref EMAIL_REGEX: Regex = Regex::new(
            r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        ).unwrap();
    }
    EMAIL_REGEX.is_match(email)
}

/// Validate phone number format
pub fn is_valid_phone(phone: &str) -> bool {
    use regex::Regex;
    lazy_static::lazy_static! {
        static ref PHONE_REGEX: Regex = Regex::new(r"^\+?[\d\s\-\(\)]+$").unwrap();
    }
    PHONE_REGEX.is_match(phone) && phone.chars().filter(|c| c.is_digit(10)).count() >= 10
}

/// Calculate percentage
pub fn calculate_percentage(part: f64, total: f64) -> f64 {
    if total == 0.0 {
        0.0
    } else {
        (part / total) * 100.0
    }
}

/// Round to 2 decimal places
pub fn round_to_cents(amount: f64) -> f64 {
    (amount * 100.0).round() / 100.0
}

/// Group items by a key function
pub fn group_by<T, K, F>(items: &[T], key_fn: F) -> HashMap<K, Vec<&T>>
where
    K: std::hash::Hash + Eq,
    F: Fn(&T) -> K,
{
    let mut groups: HashMap<K, Vec<&T>> = HashMap::new();
    
    for item in items {
        let key = key_fn(item);
        groups.entry(key).or_insert_with(Vec::new).push(item);
    }
    
    groups
}

/// Safe division that returns 0.0 if denominator is 0
pub fn safe_divide(numerator: f64, denominator: f64) -> f64 {
    if denominator == 0.0 {
        0.0
    } else {
        numerator / denominator
    }
}

/// Get time ago string
pub fn time_ago(dt: &DateTime<Utc>) -> String {
    let now = Utc::now();
    let duration = now.signed_duration_since(*dt);
    
    if duration.num_seconds() < 60 {
        "just now".to_string()
    } else if duration.num_minutes() < 60 {
        format!("{} minutes ago", duration.num_minutes())
    } else if duration.num_hours() < 24 {
        format!("{} hours ago", duration.num_hours())
    } else if duration.num_days() < 7 {
        format!("{} days ago", duration.num_days())
    } else {
        format_date(dt)
    }
}

/// Pagination helper
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pagination {
    pub page: usize,
    pub per_page: usize,
    pub total: usize,
}

impl Pagination {
    pub fn new(page: usize, per_page: usize, total: usize) -> Self {
        Self {
            page,
            per_page,
            total,
        }
    }

    pub fn offset(&self) -> usize {
        self.page * self.per_page
    }

    pub fn total_pages(&self) -> usize {
        (self.total + self.per_page - 1) / self.per_page
    }

    pub fn has_next(&self) -> bool {
        self.page + 1 < self.total_pages()
    }

    pub fn has_prev(&self) -> bool {
        self.page > 0
    }
}

/// Paginate a slice of items
pub fn paginate<T>(items: &[T], pagination: &Pagination) -> &[T] {
    let start = pagination.offset();
    let end = (start + pagination.per_page).min(items.len());
    
    if start >= items.len() {
        &[]
    } else {
        &items[start..end]
    }
}

/// Error types for the application
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    
    #[error("Validation error: {0}")]
    Validation(String),
    
    #[error("Not found: {0}")]
    NotFound(String),
    
    #[error("Unauthorized: {0}")]
    Unauthorized(String),
    
    #[error("Internal error: {0}")]
    Internal(String),
}

/// Result type for the application
pub type AppResult<T> = Result<T, AppError>;

/// Constants for the application
pub mod constants {
    /// Maximum number of tables
    pub const MAX_TABLES: i32 = 20;
    
    /// Default items per page
    pub const DEFAULT_PER_PAGE: usize = 20;
    
    /// Maximum items per page
    pub const MAX_PER_PAGE: usize = 100;
    
    /// Default sync interval in hours
    pub const DEFAULT_SYNC_INTERVAL_HOURS: u64 = 24;
    
    /// Maximum days without sync
    pub const MAX_DAYS_WITHOUT_SYNC: u64 = 3;
    
    /// API timeout in seconds
    pub const API_TIMEOUT_SECONDS: u64 = 30;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_currency() {
        assert_eq!(format_currency(12.345), "$12.35");
        assert_eq!(format_currency(0.0), "$0.00");
        assert_eq!(format_currency(100.0), "$100.00");
    }

    #[test]
    fn test_is_valid_email() {
        assert!(is_valid_email("test@example.com"));
        assert!(is_valid_email("user.name@domain.co.uk"));
        assert!(!is_valid_email("invalid-email"));
        assert!(!is_valid_email("@domain.com"));
    }

    #[test]
    fn test_is_valid_phone() {
        assert!(is_valid_phone("555-123-4567"));
        assert!(is_valid_phone("(555) 123-4567"));
        assert!(is_valid_phone("+1 555 123 4567"));
        assert!(!is_valid_phone("123"));
        assert!(!is_valid_phone("abc-def-ghij"));
    }

    #[test]
    fn test_calculate_percentage() {
        assert_eq!(calculate_percentage(25.0, 100.0), 25.0);
        assert_eq!(calculate_percentage(0.0, 100.0), 0.0);
        assert_eq!(calculate_percentage(100.0, 0.0), 0.0);
    }

    #[test]
    fn test_round_to_cents() {
        assert_eq!(round_to_cents(12.345), 12.35);
        assert_eq!(round_to_cents(12.344), 12.34);
        assert_eq!(round_to_cents(12.0), 12.0);
    }

    #[test]
    fn test_pagination() {
        let pagination = Pagination::new(0, 10, 25);
        assert_eq!(pagination.offset(), 0);
        assert_eq!(pagination.total_pages(), 3);
        assert!(pagination.has_next());
        assert!(!pagination.has_prev());

        let pagination = Pagination::new(2, 10, 25);
        assert_eq!(pagination.offset(), 20);
        assert!(!pagination.has_next());
        assert!(pagination.has_prev());
    }

    #[test]
    fn test_paginate() {
        let items = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let pagination = Pagination::new(0, 3, items.len());
        
        let page = paginate(&items, &pagination);
        assert_eq!(page, &[1, 2, 3]);

        let pagination = Pagination::new(1, 3, items.len());
        let page = paginate(&items, &pagination);
        assert_eq!(page, &[4, 5, 6]);
    }
} 