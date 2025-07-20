#!/bin/bash

# Script to extract downloaded crates to vendor directory
VENDOR_DIR="src-tauri/vendor"
DOWNLOADS_DIR="$HOME/Downloads"

echo "Extracting crates to vendor directory..."

# Create vendor directory if it doesn't exist
mkdir -p "$VENDOR_DIR"

# List of crates to extract
crates=(
    "tauri-2.0.0"
    "tauri-build-2.0.0"
    "serde-1.0.219"
    "serde_json-1.0.108"
    "tokio-1.0.0"
    "axum-0.7.9"
    "tower-0.4.13"
    "tower-http-0.5.2"
    "sqlx-0.7.4"
    "chrono-0.4.41"
    "uuid-1.0.0"
    "tracing-0.1.40"
    "tracing-subscriber-0.3.18"
    "anyhow-1.0.98"
    "thiserror-1.0.69"
    "config-0.14.1"
    "once_cell-1.19.0"
    "reqwest-0.11.27"
    "futures-0.3.30"
    "dirs-5.0.1"
    "rand-0.8.5"
    "regex-1.11.1"
    "lazy_static-1.4.0"
    "walkdir-2.5.0"
)

# Extract each crate
for crate in "${crates[@]}"; do
    crate_file="$DOWNLOADS_DIR/$crate.crate"
    crate_dir="$VENDOR_DIR/$crate"
    
    if [ -f "$crate_file" ]; then
        echo "Extracting $crate..."
        mkdir -p "$crate_dir"
        tar -xzf "$crate_file" -C "$crate_dir"
        echo "✓ Extracted $crate"
    else
        echo "⚠ Warning: $crate_file not found"
    fi
done

echo "Done! All crates extracted to $VENDOR_DIR" 