#!/usr/bin/env node

/**
 * Generate placeholder icons for Tauri application
 * This script creates basic SVG icons in different sizes
 */

const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '../src-tauri/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

// Simple POS icon SVG
const iconSvg = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="16" fill="#3B82F6"/>
  <rect x="24" y="32" width="80" height="64" rx="8" fill="white"/>
  <rect x="32" y="40" width="64" height="8" rx="4" fill="#3B82F6"/>
  <rect x="32" y="56" width="48" height="8" rx="4" fill="#6B7280"/>
  <rect x="32" y="72" width="56" height="8" rx="4" fill="#6B7280"/>
  <rect x="32" y="88" width="40" height="8" rx="4" fill="#6B7280"/>
  <circle cx="88" cy="72" r="12" fill="#10B981"/>
  <text x="88" y="76" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">$</text>
</svg>
`;

// Generate different icon sizes
const sizes = [
    { name: '32x32.png', size: 32 },
    { name: '128x128.png', size: 128 },
    { name: '128x128@2x.png', size: 256 },
];

// For now, we'll create SVG files that can be converted to PNG later
sizes.forEach(({ name, size }) => {
    const svgContent = iconSvg.replace(/width="128" height="128"/g, `width="${size}" height="${size}"`);
    const svgPath = path.join(iconDir, name.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, svgContent);
    console.log(`Created ${svgPath}`);
});

// Create a simple .icns file placeholder (macOS)
const icnsPath = path.join(iconDir, 'icon.icns');
fs.writeFileSync(icnsPath, '');
console.log(`Created placeholder ${icnsPath}`);

// Create a simple .ico file placeholder (Windows)
const icoPath = path.join(iconDir, 'icon.ico');
fs.writeFileSync(icoPath, '');
console.log(`Created placeholder ${icoPath}`);

console.log('\nIcon generation complete!');
console.log('Note: You may want to replace these placeholder icons with proper PNG/ICO/ICNS files for production.'); 