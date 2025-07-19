//! Data synchronization service for the POS application
//! 
//! This module handles:
//! - Periodic data synchronization with cloud services
//! - Sync status tracking and enforcement
//! - Offline-first functionality with sync requirements
//! - Background sync operations

use std::sync::Arc;
use std::time::Duration;
use chrono::{DateTime, Utc};
use tokio::time::interval;
use tracing::{info, error, warn};
use anyhow::Result;

use crate::{AppState, db::{self, models::*}, config::Config};

/// Sync service for managing data synchronization
pub struct SyncService {
    db: Arc<db::Database>,
    config: Config,
    sync_interval: Duration,
}

impl SyncService {
    /// Create a new sync service
    pub fn new(db: Arc<db::Database>, config: Config) -> Self {
        let sync_interval = Duration::from_secs(config.sync_interval_hours * 3600);
        
        Self {
            db,
            config,
            sync_interval,
        }
    }

    /// Start the sync service in the background
    pub async fn start(&self) {
        info!("Starting sync service with interval: {:?}", self.sync_interval);
        
        let db = self.db.clone();
        let config = self.config.clone();
        let sync_interval = self.sync_interval;

        tokio::spawn(async move {
            let mut interval = interval(sync_interval);
            
            loop {
                interval.tick().await;
                
                if let Err(e) = Self::perform_sync(&db, &config).await {
                    error!("Sync failed: {}", e);
                }
            }
        });
    }

    /// Perform a sync operation
    async fn perform_sync(db: &Arc<db::Database>, config: &Config) -> Result<()> {
        info!("Starting sync operation...");
        
        let mut sync_status = SyncStatus {
            id: 0,
            last_sync_at: Some(Utc::now()),
            sync_status: SyncStatusType::InProgress,
            error_message: None,
            created_at: Utc::now(),
        };

        // Update sync status to in progress
        db::queries::update_sync_status(db.pool(), &sync_status).await?;

        match Self::sync_with_cloud(db, config).await {
            Ok(_) => {
                sync_status.sync_status = SyncStatusType::Completed;
                info!("Sync completed successfully");
            }
            Err(e) => {
                sync_status.sync_status = SyncStatusType::Failed;
                sync_status.error_message = Some(e.to_string());
                error!("Sync failed: {}", e);
            }
        }

        // Update final sync status
        db::queries::update_sync_status(db.pool(), &sync_status).await?;
        
        Ok(())
    }

    /// Sync data with cloud service (stubbed implementation)
    async fn sync_with_cloud(db: &Arc<db::Database>, config: &Config) -> Result<()> {
        // Check if cloud sync is configured
        if config.cloud_sync_url.is_none() {
            warn!("Cloud sync URL not configured, skipping sync");
            return Ok(());
        }

        // Get data to sync
        let menu_items = db::queries::get_menu_items(db.pool()).await?;
        let orders = db::queries::get_orders(db.pool()).await?;
        let staff = db::queries::get_staff(db.pool()).await?;

        // Create sync payload
        let sync_payload = SyncPayload {
            menu_items,
            orders,
            staff,
            timestamp: Utc::now(),
        };

        // Send to cloud (stubbed - would use actual HTTP client)
        info!("Syncing {} menu items, {} orders, {} staff members", 
              sync_payload.menu_items.len(),
              sync_payload.orders.len(),
              sync_payload.staff.len());

        // Simulate network delay
        tokio::time::sleep(Duration::from_millis(500)).await;

        // Simulate occasional sync failures (10% chance)
        if rand::random::<f64>() < 0.1 {
            return Err(anyhow::anyhow!("Simulated sync failure"));
        }

        info!("Cloud sync completed successfully");
        Ok(())
    }

    /// Get current sync status
    pub async fn get_status(&self) -> SyncStatus {
        match db::queries::get_sync_status(self.db.pool()).await {
            Ok(Some(status)) => status,
            Ok(None) => SyncStatus {
                id: 0,
                last_sync_at: None,
                sync_status: SyncStatusType::Pending,
                error_message: None,
                created_at: Utc::now(),
            },
            Err(e) => {
                error!("Failed to get sync status: {}", e);
                SyncStatus {
                    id: 0,
                    last_sync_at: None,
                    sync_status: SyncStatusType::Failed,
                    error_message: Some(e.to_string()),
                    created_at: Utc::now(),
                }
            }
        }
    }

    /// Check if sync is required (blocking access if too old)
    pub async fn is_sync_required(&self) -> bool {
        let status = self.get_status().await;
        
        match status.last_sync_at {
            Some(last_sync) => {
                let days_since_sync = (Utc::now() - last_sync).num_days();
                days_since_sync > self.config.max_days_without_sync as i64
            }
            None => true, // Never synced
        }
    }

    /// Force a sync operation now
    pub async fn sync_now(&self) -> Result<crate::api::SyncResult> {
        info!("Manual sync requested");
        
        match Self::perform_sync(&self.db, &self.config).await {
            Ok(_) => Ok(crate::api::SyncResult {
                success: true,
                message: "Sync completed successfully".to_string(),
                timestamp: Utc::now(),
            }),
            Err(e) => Ok(crate::api::SyncResult {
                success: false,
                message: format!("Sync failed: {}", e),
                timestamp: Utc::now(),
            }),
        }
    }

    /// Get sync statistics
    pub async fn get_sync_stats(&self) -> SyncStats {
        let status = self.get_status().await;
        let is_required = self.is_sync_required().await;
        
        SyncStats {
            last_sync: status.last_sync_at,
            sync_status: status.sync_status,
            is_sync_required: is_required,
            sync_interval_hours: self.config.sync_interval_hours,
            max_days_without_sync: self.config.max_days_without_sync,
        }
    }
}

/// Sync payload for cloud synchronization
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct SyncPayload {
    menu_items: Vec<MenuItem>,
    orders: Vec<Order>,
    staff: Vec<Staff>,
    timestamp: DateTime<Utc>,
}

/// Sync statistics
#[derive(Debug, Clone, serde::Serialize)]
pub struct SyncStats {
    pub last_sync: Option<DateTime<Utc>>,
    pub sync_status: SyncStatusType,
    pub is_sync_required: bool,
    pub sync_interval_hours: u64,
    pub max_days_without_sync: u64,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_sync_status_creation() {
        let status = SyncStatus {
            id: 1,
            last_sync_at: Some(Utc::now()),
            sync_status: SyncStatusType::Completed,
            error_message: None,
            created_at: Utc::now(),
        };

        assert_eq!(status.sync_status.to_string(), "Completed");
    }

    #[test]
    fn test_sync_payload_serialization() {
        let payload = SyncPayload {
            menu_items: vec![],
            orders: vec![],
            staff: vec![],
            timestamp: Utc::now(),
        };

        let json = serde_json::to_string(&payload).unwrap();
        assert!(!json.is_empty());
    }
} 