<?php
/**
 * House Unlimited Database Setup Script
 *
 * This script sets up the necessary database tables for the migration
 * Run this before running the main migration script
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}

class HU_Database_Setup {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
    }

    /**
     * Add admin menu for database setup
     */
    public function add_admin_menu() {
        add_submenu_page(
            'tools.php',
            'HU Database Setup',
            'HU Database Setup',
            'manage_options',
            'hu-db-setup',
            [$this, 'admin_page']
        );
    }

    /**
     * Admin page for database setup
     */
    public function admin_page() {
        if (isset($_POST['setup_database'])) {
            $this->setup_database();
        }

        ?>
        <div class="wrap">
            <h1>House Unlimited Database Setup</h1>
            <p>This tool will create the necessary database tables for the House Unlimited plugin.</p>

            <form method="post">
                <?php wp_nonce_field('hu_db_setup'); ?>
                <p>
                    <input type="submit" name="setup_database" class="button button-primary" value="Create Database Tables">
                </p>
            </form>

            <h2>Database Tables to be Created:</h2>
            <ul>
                <li><code><?php echo $this->get_table_name('hu_inquiries'); ?></code> - Property inquiries</li>
                <li><code><?php echo $this->get_table_name('hu_reviews'); ?></code> - Property reviews</li>
                <li><code><?php echo $this->get_table_name('hu_wishlist'); ?></code> - User wishlists</li>
                <li><code><?php echo $this->get_table_name('hu_user_profiles'); ?></code> - Extended user profiles</li>
                <li><code><?php echo $this->get_table_name('hu_newsletter_subscribers'); ?></code> - Newsletter subscribers</li>
                <li><code><?php echo $this->get_table_name('hu_property_views'); ?></code> - Property view tracking</li>
            </ul>
        </div>
        <?php
    }

    /**
     * Setup database tables
     */
    public function setup_database() {
        global $wpdb;

        // Check nonce
        if (!wp_verify_nonce($_POST['_wpnonce'], 'hu_db_setup')) {
            wp_die('Security check failed');
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $charset_collate = $wpdb->get_charset_collate();
        $tables_created = 0;

        // Inquiries table
        $table_inquiries = $this->get_table_name('hu_inquiries');
        $sql_inquiries = "CREATE TABLE $table_inquiries (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) unsigned NOT NULL,
            user_id bigint(20) unsigned DEFAULT NULL,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            phone varchar(50) DEFAULT '',
            message text NOT NULL,
            inquiry_type varchar(50) DEFAULT 'general',
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY property_id (property_id),
            KEY user_id (user_id),
            KEY status (status)
        ) $charset_collate;";

        if ($this->create_table($sql_inquiries, $table_inquiries)) {
            $tables_created++;
        }

        // Reviews table
        $table_reviews = $this->get_table_name('hu_reviews');
        $sql_reviews = "CREATE TABLE $table_reviews (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) unsigned NOT NULL,
            user_id bigint(20) unsigned DEFAULT NULL,
            rating tinyint(1) NOT NULL DEFAULT 5,
            title varchar(255) DEFAULT '',
            review text NOT NULL,
            verified tinyint(1) DEFAULT 0,
            status varchar(20) DEFAULT 'approved',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY property_id (property_id),
            KEY user_id (user_id),
            KEY rating (rating),
            KEY status (status)
        ) $charset_collate;";

        if ($this->create_table($sql_reviews, $table_reviews)) {
            $tables_created++;
        }

        // Wishlist table
        $table_wishlist = $this->get_table_name('hu_wishlist');
        $sql_wishlist = "CREATE TABLE $table_wishlist (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            property_id bigint(20) unsigned NOT NULL,
            added_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY user_property (user_id, property_id),
            KEY user_id (user_id),
            KEY property_id (property_id)
        ) $charset_collate;";

        if ($this->create_table($sql_wishlist, $table_wishlist)) {
            $tables_created++;
        }

        // User profiles table
        $table_profiles = $this->get_table_name('hu_user_profiles');
        $sql_profiles = "CREATE TABLE $table_profiles (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            phone varchar(50) DEFAULT '',
            bio text DEFAULT '',
            location varchar(255) DEFAULT '',
            avatar_url varchar(500) DEFAULT '',
            linkedin varchar(255) DEFAULT '',
            twitter varchar(255) DEFAULT '',
            facebook varchar(255) DEFAULT '',
            preferences text DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY user_id (user_id)
        ) $charset_collate;";

        if ($this->create_table($sql_profiles, $table_profiles)) {
            $tables_created++;
        }

        // Newsletter subscribers table
        $table_newsletter = $this->get_table_name('hu_newsletter_subscribers');
        $sql_newsletter = "CREATE TABLE $table_newsletter (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            email varchar(255) NOT NULL,
            name varchar(255) DEFAULT '',
            subscribed_at datetime DEFAULT CURRENT_TIMESTAMP,
            status varchar(20) DEFAULT 'active',
            PRIMARY KEY (id),
            UNIQUE KEY email (email)
        ) $charset_collate;";

        if ($this->create_table($sql_newsletter, $table_newsletter)) {
            $tables_created++;
        }

        // Property views table
        $table_views = $this->get_table_name('hu_property_views');
        $sql_views = "CREATE TABLE $table_views (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) unsigned NOT NULL,
            user_id bigint(20) unsigned DEFAULT NULL,
            ip_address varchar(45) DEFAULT '',
            user_agent text DEFAULT '',
            viewed_at datetime DEFAULT CURRENT_TIMESTAMP,
            session_id varchar(255) DEFAULT '',
            PRIMARY KEY (id),
            KEY property_id (property_id),
            KEY user_id (user_id),
            KEY viewed_at (viewed_at)
        ) $charset_collate;";

        if ($this->create_table($sql_views, $table_views)) {
            $tables_created++;
        }

        // Show success message
        echo '<div class="notice notice-success"><p>';
        echo "✅ Database setup completed! Created $tables_created tables successfully.";
        echo '</p></div>';

        // Log the setup
        error_log("House Unlimited: Database tables created at " . current_time('mysql'));
    }

    /**
     * Create a database table
     */
    private function create_table($sql, $table_name) {
        global $wpdb;

        // Check if table already exists
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name) {
            echo "<p>Table <code>$table_name</code> already exists, skipping...</p>";
            return false;
        }

        // Include upgrade.php for dbDelta
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Create table
        dbDelta($sql);

        // Check if table was created successfully
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name) {
            echo "<p>✅ Created table <code>$table_name</code></p>";
            return true;
        } else {
            echo "<p>❌ Failed to create table <code>$table_name</code></p>";
            return false;
        }
    }

    /**
     * Get full table name with prefix
     */
    private function get_table_name($table) {
        global $wpdb;
        return $wpdb->prefix . $table;
    }
}

// Initialize the database setup
new HU_Database_Setup();