# House Unlimited Data Migration Scripts

This directory contains scripts to migrate data from your existing MongoDB-based React application to WordPress.

## Prerequisites

1. **MongoDB PHP Extension**: Install the MongoDB PHP extension
   ```bash
   # For Ubuntu/Debian
   sudo apt-get install php-mongodb

   # For CentOS/RHEL
   sudo yum install php-pecl-mongodb

   # For macOS with Homebrew
   brew install php@8.1-mongodb
   ```

2. **MongoDB PHP Library**: Install via Composer
   ```bash
   composer require mongodb/mongodb
   ```

3. **WordPress Setup**: Ensure WordPress is installed and the House Unlimited theme/plugin are activated

4. **Database Backup**: Always backup your WordPress database before running migrations

## Configuration

Edit `config.php` to match your MongoDB settings:

```php
define('HU_MONGODB_HOST', 'localhost');
define('HU_MONGODB_PORT', '27017');
define('HU_MONGODB_DATABASE', 'houseunlimited');
define('HU_MONGODB_USERNAME', ''); // Add if authentication required
define('HU_MONGODB_PASSWORD', ''); // Add if authentication required
```

## Migration Steps

### 1. Setup Database Tables

First, create the necessary database tables:

1. Copy `setup-database.php` to your WordPress root directory
2. Access the admin page: `wp-admin/tools.php?page=hu-db-setup`
3. Click "Create Database Tables"

### 2. Run Full Migration

For a complete migration of all data:

1. Copy `migrate-data.php` to your WordPress root directory
2. Access the migration page: `yoursite.com/migrate-data.php?run_migration=1`
3. Monitor the progress in the browser

### 3. Incremental Migration (Recommended)

For large datasets or ongoing migration:

```php
require_once 'incremental-migration.php';

$migration = new HU_Incremental_Migration();

// Migrate users in batches
$result = $migration->run_incremental_migration('users', 10);
echo "Migrated: " . $result['migrated'] . " users\n";

// Migrate properties
$result = $migration->run_incremental_migration('properties', 25);
echo "Migrated: " . $result['migrated'] . " properties\n";

// Continue with other data types...
```

## Data Types Migrated

### Users
- WordPress users with custom meta fields
- Fields: email, firstName, lastName, phone, bio, location, avatar
- User roles: subscriber, agent, etc.

### Properties
- Custom post type: `property`
- Taxonomies: property_type, property_status
- Meta fields: price, address, beds, baths, sqft, etc.
- Gallery images and featured images

### Agents
- Custom post type: `agent`
- Meta fields: role, phone, email, specialties, etc.
- Featured images (agent photos)

### Blog Posts
- Standard WordPress posts
- Categories and featured images

### Inquiries
- Custom table: `wp_hu_inquiries`
- Fields: property_id, user_id, name, email, message, etc.

### Reviews
- Custom table: `wp_hu_reviews`
- Fields: property_id, user_id, rating, review, etc.

### Newsletter Subscribers
- Custom table: `wp_hu_newsletter_subscribers`
- Fields: email, name, status, subscribed_at

## Rollback Functionality

To rollback migrated data (use with caution):

```php
$migration = new HU_Incremental_Migration();

// Rollback properties
$result = $migration->rollback_migration('properties');
echo "Deleted: " . $result['deleted'] . " properties\n";

// Rollback other data types...
```

**Warning**: Rollback will permanently delete migrated data. Always backup first!

## Monitoring and Logging

### Logs
- `migration.log`: General migration activity
- `migration-errors.log`: Errors and issues

### Progress Tracking
Check migration progress:

```php
$progress = hu_get_migration_progress();
print_r($progress);
```

### Admin Dashboard Integration

The migration scripts integrate with WordPress admin for monitoring:

- View migration status in Tools > HU Migration Status
- Run incremental migrations from admin
- View logs and error reports

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running
   - Verify connection string in config.php
   - Ensure MongoDB PHP extension is installed

2. **Memory Limit Exceeded**
   - Increase PHP memory limit: `ini_set('memory_limit', '512M');`
   - Reduce batch size in incremental migration

3. **Timeout Errors**
   - Increase timeout settings in config.php
   - Use incremental migration for large datasets

4. **Duplicate Data**
   - Check for existing data before migration
   - Use incremental migration to avoid duplicates

### Performance Optimization

1. **Large Datasets**: Use incremental migration with smaller batch sizes
2. **Images**: Large image files may cause timeouts - consider migrating images separately
3. **Relationships**: Property-agent relationships may need manual mapping after migration

## Post-Migration Tasks

1. **Update Permalinks**: Go to Settings > Permalinks and save
2. **Regenerate Thumbnails**: Use a plugin like "Regenerate Thumbnails"
3. **Update Internal Links**: Check for any hardcoded URLs that need updating
4. **Test Functionality**: Verify all features work with migrated data
5. **SEO Considerations**: Update sitemaps and check for broken links

## Support

For issues with migration:

1. Check the error logs: `migration-errors.log`
2. Verify MongoDB data structure matches expectations
3. Test with small dataset first
4. Contact support with specific error messages

## Security Notes

- Remove migration files from web-accessible directories after completion
- Store MongoDB credentials securely
- Backup all data before migration
- Test migrations on staging environment first