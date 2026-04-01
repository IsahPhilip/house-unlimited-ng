<?php
/**
 * Plugin Name: House Unlimited Features
 * Plugin URI: https://houseunlimited.ng
 * Description: Custom features for House Unlimited WordPress theme including wishlist, inquiries, reviews, and user account enhancements.
 * Version: 1.0.0
 * Author: House Unlimited
 * License: GPL v2 or later
 * Text Domain: house-unlimited-features
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HU_FEATURES_VERSION', '1.0.0');
define('HU_FEATURES_DIR', plugin_dir_path(__FILE__));
define('HU_FEATURES_URL', plugin_dir_url(__FILE__));

// Include required files
require_once HU_FEATURES_DIR . 'includes/class-wishlist.php';
require_once HU_FEATURES_DIR . 'includes/class-inquiries.php';
require_once HU_FEATURES_DIR . 'includes/class-reviews.php';
require_once HU_FEATURES_DIR . 'includes/class-user-profile.php';

/**
 * Main plugin class
 */
class House_Unlimited_Features {

    /**
     * Initialize the plugin
     */
    public static function init() {
        // Initialize components
        Wishlist::init();
        Inquiries::init();
        Reviews::init();
        User_Profile::init();

        // Register activation hook
        register_activation_hook(__FILE__, [__CLASS__, 'activate']);

        // Register deactivation hook
        register_deactivation_hook(__FILE__, [__CLASS__, 'deactivate']);
    }

    /**
     * Plugin activation
     */
    public static function activate() {
        // Create database tables if needed
        self::create_tables();

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation
     */
    public static function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Create custom database tables
     */
    private static function create_tables() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Inquiries table
        $table_inquiries = $wpdb->prefix . 'hu_inquiries';
        $sql_inquiries = "CREATE TABLE $table_inquiries (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) NOT NULL,
            user_id bigint(20) DEFAULT NULL,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            phone varchar(50) DEFAULT '',
            message text NOT NULL,
            inquiry_type varchar(50) DEFAULT 'general',
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY property_id (property_id),
            KEY user_id (user_id)
        ) $charset_collate;";

        // Reviews table
        $table_reviews = $wpdb->prefix . 'hu_reviews';
        $sql_reviews = "CREATE TABLE $table_reviews (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) NOT NULL,
            user_id bigint(20) NOT NULL,
            rating tinyint(1) NOT NULL,
            title varchar(255) DEFAULT '',
            review text NOT NULL,
            verified tinyint(1) DEFAULT 0,
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY property_id (property_id),
            KEY user_id (user_id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_inquiries);
        dbDelta($sql_reviews);
    }
}

// Initialize the plugin
House_Unlimited_Features::init();