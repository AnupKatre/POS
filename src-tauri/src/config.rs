//! Configuration management for the POS application
//! 
//! This module handles loading and managing application configuration
//! including database settings, sync intervals, and API endpoints.

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use anyhow::Result;

/// Application configuration structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    /// Database connection URL
    pub database_url: String,
    /// API server port
    pub api_port: u16,
    /// Sync interval in hours
    pub sync_interval_hours: u64,
    /// Maximum days without sync before blocking access
    pub max_days_without_sync: u64,
    /// Cloud sync endpoint (optional)
    pub cloud_sync_url: Option<String>,
    /// Application data directory
    pub data_dir: PathBuf,
}

impl Config {
    /// Load configuration from file or create default
    pub fn load() -> Result<Self> {
        let config_path = Self::get_config_path()?;
        
        if config_path.exists() {
            let content = std::fs::read_to_string(&config_path)?;
            let config: Config = serde_json::from_str(&content)?;
            Ok(config)
        } else {
            let config = Self::default();
            config.save()?;
            Ok(config)
        }
    }

    /// Save configuration to file
    pub fn save(&self) -> Result<()> {
        let config_path = Self::get_config_path()?;
        let content = serde_json::to_string_pretty(self)?;
        std::fs::write(config_path, content)?;
        Ok(())
    }

    /// Get configuration file path
    fn get_config_path() -> Result<PathBuf> {
        let mut config_dir = dirs::config_dir()
            .ok_or_else(|| anyhow::anyhow!("Could not find config directory"))?;
        config_dir.push("pos-app");
        std::fs::create_dir_all(&config_dir)?;
        config_dir.push("config.json");
        Ok(config_dir)
    }
}

impl Default for Config {
    fn default() -> Self {
        Self {
            database_url: "sqlite:pos_app.db".to_string(),
            api_port: 3001,
            sync_interval_hours: 24,
            max_days_without_sync: 3,
            cloud_sync_url: None,
            data_dir: dirs::data_dir()
                .unwrap_or_else(|| PathBuf::from("."))
                .join("pos-app"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_default() {
        let config = Config::default();
        assert_eq!(config.api_port, 3001);
        assert_eq!(config.sync_interval_hours, 24);
        assert_eq!(config.max_days_without_sync, 3);
    }
} 