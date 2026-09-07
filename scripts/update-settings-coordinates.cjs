#!/usr/bin/env node
// One-off script (CommonJS): fetch current settings.address from the headless REST API,
// geocode it via OpenStreetMap Nominatim, then POST latitude/longitude
// back to the WordPress headless REST route to persist them.

// Usage:
// HUN_WP_URL="https://your-wordpress.example.com" HUN_UPDATE_SECRET="mysecret" node scripts/update-settings-coordinates.cjs
// or
// node scripts/update-settings-coordinates.cjs --wp-url http://localhost/wordpress --secret mysecret

const { argv, env } = require('process');
const fetch = global.fetch || require('node-fetch');

function parseArgs() {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--wp-url') {
      args.wpUrl = argv[++i];
    } else if (arg === '--secret') {
      args.secret = argv[++i];
    } else if (arg === '--address') {
      args.address = argv[++i];
    }
  }
  args.wpUrl = args.wpUrl || env.HUN_WP_URL || env.WP_URL || 'http://localhost/wordpress';
  args.secret = args.secret || env.HUN_UPDATE_SECRET || env.HUN_API_UPDATE_SECRET || '';
  args.address = args.address || env.HUN_OVERRIDE_ADDRESS || '';
  return args;
}

(async function main() {
  try {
    const args = parseArgs();
    const { wpUrl, secret } = args;
    if (!secret) {
      console.error('Error: secret is required. Provide via --secret or HUN_UPDATE_SECRET env var.');
      process.exit(2);
    }

    const settingsUrl = `${wpUrl.replace(/\/$/, '')}/wp-json/hun/v1/settings`;
    console.log('Fetching settings from', settingsUrl);

    const settingsResp = await fetch(settingsUrl);
    if (!settingsResp.ok) throw new Error('Failed to fetch settings: ' + settingsResp.statusText);
    const settings = await settingsResp.json();

    const address = args.address || settings.address || '';
    if (!address) {
      console.error('No address found in settings; aborting.');
      process.exit(1);
    }

    console.log('Geocoding address:', address);
    const nominatim = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const geoResp = await fetch(nominatim, { headers: { 'User-Agent': 'house-unlimited-coordinate-updater/1.0 (contact@houseunlimitednigeria.com)' } });
    if (!geoResp.ok) throw new Error('Geocode failed: ' + geoResp.statusText);
    const geo = await geoResp.json();

    if (!Array.isArray(geo) || geo.length === 0) {
      console.error('No geocode result found for address.');
      process.exit(1);
    }

    const { lat, lon } = geo[0];
    console.log('Found coordinates:', lat, lon);

    const postUrl = `${wpUrl.replace(/\/$/, '')}/wp-json/hun/v1/settings/coordinates`;
    console.log('Posting coordinates to', postUrl);

    const postResp = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon, secret })
    });

    const postResult = await postResp.json().catch(() => null);
    if (!postResp.ok) {
      console.error('Failed to save coordinates:', postResp.status, postResp.statusText, postResult);
      process.exit(1);
    }

    console.log('Saved coordinates successfully:', postResult);
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
