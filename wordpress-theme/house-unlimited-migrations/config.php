<?php
/**
 * House Unlimited Migration Configuration
 *
 * Configuration settings for data migration from MongoDB to WordPress
 */

// MongoDB Configuration
define('HU_MONGODB_HOST', 'localhost');
define('HU_MONGODB_PORT', '27017');
define('HU_MONGODB_DATABASE', 'houseunlimited');
define('HU_MONGODB_USERNAME', ''); // Add username if authentication is required
define('HU_MONGODB_PASSWORD', ''); // Add password if authentication is required

// Migration Settings
define('HU_MIGRATION_BATCH_SIZE', 50); // Number of records to process at once
define('HU_MIGRATION_TIMEOUT', 300); // Timeout in seconds for each batch
define('HU_MIGRATION_BACKUP_FIRST', true); // Create backup before migration

// Data Mapping Configuration
$hu_data_mapping = [
    // MongoDB collection => WordPress post type
    'properties' => 'property',
    'agents' => 'agent',
    'blogposts' => 'post',

    // Custom tables for complex data
    'inquiries' => 'hu_inquiries',
    'reviews' => 'hu_reviews',
    'newsletters' => 'hu_newsletter_subscribers',
];

// Field mapping for properties
$hu_property_field_mapping = [
    'title' => 'post_title',
    'description' => 'post_content',
    'price' => 'price',
    'address' => 'address',
    'beds' => 'beds',
    'baths' => 'baths',
    'sqft' => 'sqft',
    'yearBuilt' => 'year_built',
    'lotSize' => 'lot_size',
    'parking' => 'parking',
    'featured' => 'featured',
    'agentId' => 'agent_id',
    'images' => 'gallery',
    'featuredImage' => 'featured_image',
];

// Field mapping for agents
$hu_agent_field_mapping = [
    'name' => 'post_title',
    'bio' => 'post_content',
    'role' => 'role',
    'phone' => 'phone',
    'email' => 'email',
    'specialties' => 'specialties',
    'officeLocation' => 'office_location',
    'photo' => 'featured_image',
    'linkedin' => 'linkedin',
    'twitter' => 'twitter',
    'facebook' => 'facebook',
];

// Field mapping for blog posts
$hu_blog_field_mapping = [
    'title' => 'post_title',
    'content' => 'post_content',
    'excerpt' => 'post_excerpt',
    'categories' => 'categories',
    'featuredImage' => 'featured_image',
    'createdAt' => 'post_date',
];

// Migration status tracking
$hu_migration_status = [
    'users' => false,
    'properties' => false,
    'agents' => false,
    'blog_posts' => false,
    'inquiries' => false,
    'reviews' => false,
    'subscribers' => false,
];

// Error handling
define('HU_MIGRATION_LOG_FILE', __DIR__ . '/migration.log');
define('HU_MIGRATION_ERROR_LOG', __DIR__ . '/migration-errors.log');

// Image migration settings
define('HU_IMAGE_UPLOAD_DIR', 'hu-migrated-images');
define('HU_IMAGE_TIMEOUT', 30); // seconds
define('HU_MAX_IMAGE_SIZE', 10 * 1024 * 1024); // 10MB

// User migration settings
define('HU_DEFAULT_USER_ROLE', 'subscriber');
define('HU_AGENT_USER_ROLE', 'agent'); // Custom role for agents

// Property migration settings
define('HU_DEFAULT_PROPERTY_STATUS', 'publish');
define('HU_DEFAULT_AGENT_ID', null); // Default agent if none specified

// Review migration settings
define('HU_DEFAULT_REVIEW_STATUS', 'approved');
define('HU_REVIEW_VERIFICATION_THRESHOLD', 3); // Minimum rating for verification

// Email settings for migration notifications
define('HU_MIGRATION_ADMIN_EMAIL', get_option('admin_email'));
define('HU_SEND_MIGRATION_REPORTS', true);

/**
 * Get MongoDB connection string
 */
function hu_get_mongodb_connection_string() {
    $host = HU_MONGODB_HOST;
    $port = HU_MONGODB_PORT;
    $database = HU_MONGODB_DATABASE;

    $connection_string = "mongodb://";

    if (HU_MONGODB_USERNAME && HU_MONGODB_PASSWORD) {
        $connection_string .= HU_MONGODB_USERNAME . ':' . HU_MONGODB_PASSWORD . '@';
    }

    $connection_string .= $host . ':' . $port . '/' . $database;

    return $connection_string;
}

/**
 * Log migration activity
 */
function hu_log_migration($message, $type = 'info') {
    $timestamp = current_time('Y-m-d H:i:s');
    $log_message = "[$timestamp] [$type] $message\n";

    // Write to log file
    file_put_contents(HU_MIGRATION_LOG_FILE, $log_message, FILE_APPEND);

    // Also log errors separately
    if ($type === 'error') {
        file_put_contents(HU_MIGRATION_ERROR_LOG, $log_message, FILE_APPEND);
    }
}

/**
 * Send migration report email
 */
function hu_send_migration_report($subject, $message) {
    if (!HU_SEND_MIGRATION_REPORTS) {
        return;
    }

    $headers = ['Content-Type: text/html; charset=UTF-8'];
    wp_mail(HU_MIGRATION_ADMIN_EMAIL, $subject, $message, $headers);
}

/**
 * Check if migration is already completed
 */
function hu_is_migration_completed($type) {
    global $hu_migration_status;
    return $hu_migration_status[$type] ?? false;
}

/**
 * Mark migration as completed
 */
function hu_mark_migration_completed($type) {
    global $hu_migration_status;
    $hu_migration_status[$type] = true;

    // Save to database
    update_option('hu_migration_status_' . $type, true);
    hu_log_migration("Migration completed for: $type");
}

/**
 * Get migration progress
 */
function hu_get_migration_progress() {
    $progress = [];

    $migration_types = ['users', 'properties', 'agents', 'blog_posts', 'inquiries', 'reviews', 'subscribers'];

    foreach ($migration_types as $type) {
        $progress[$type] = get_option('hu_migration_status_' . $type, false);
    }

    return $progress;
}

/**
 * Reset migration status (for testing)
 */
function hu_reset_migration_status() {
    $migration_types = ['users', 'properties', 'agents', 'blog_posts', 'inquiries', 'reviews', 'subscribers'];

    foreach ($migration_types as $type) {
        delete_option('hu_migration_status_' . $type);
    }

    hu_log_migration("Migration status reset");
}

/**
 * Validate MongoDB connection
 */
function hu_validate_mongodb_connection() {
    try {
        $client = new MongoDB\Client(hu_get_mongodb_connection_string());
        $client->listDatabases();
        return true;
    } catch (Exception $e) {
        hu_log_migration("MongoDB connection failed: " . $e->getMessage(), 'error');
        return false;
    }
}

/**
 * Get MongoDB collection count
 */
function hu_get_collection_count($collection_name) {
    try {
        $client = new MongoDB\Client(hu_get_mongodb_connection_string());
        $database = $client->selectDatabase(HU_MONGODB_DATABASE);
        $collection = $database->selectCollection($collection_name);
        return $collection->countDocuments();
    } catch (Exception $e) {
        hu_log_migration("Failed to count documents in $collection_name: " . $e->getMessage(), 'error');
        return 0;
    }
}