<?php
/**
 * House Unlimited Data Migration Scripts
 *
 * This script migrates data from MongoDB to WordPress
 * Run this from WordPress root directory
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}

// Include MongoDB PHP library (install via composer: composer require mongodb/mongodb)
require_once 'vendor/autoload.php';

class HU_Data_Migration {

    private $mongoClient;
    private $mongoDb;
    private $progress = [];

    public function __construct() {
        // MongoDB connection
        $this->mongoClient = new MongoDB\Client("mongodb://localhost:27017");
        $this->mongoDb = $this->mongoClient->houseunlimited;

        // Set unlimited execution time
        set_time_limit(0);
        ini_set('memory_limit', '512M');
    }

    /**
     * Main migration function
     */
    public function run_migration() {
        echo "<h1>House Unlimited Data Migration</h1>";
        echo "<pre>";

        try {
            $this->migrate_users();
            $this->migrate_properties();
            $this->migrate_agents();
            $this->migrate_blog_posts();
            $this->migrate_inquiries();
            $this->migrate_reviews();
            $this->migrate_newsletter_subscribers();

            echo "\n✅ Migration completed successfully!\n";
            $this->show_summary();

        } catch (Exception $e) {
            echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
        }

        echo "</pre>";
    }

    /**
     * Migrate users from MongoDB to WordPress
     */
    private function migrate_users() {
        echo "🔄 Migrating users...\n";

        $users = $this->mongoDb->users->find();
        $count = 0;

        foreach ($users as $user) {
            // Skip if user already exists
            if (email_exists($user->email)) {
                echo "  - Skipping existing user: {$user->email}\n";
                continue;
            }

            // Create WordPress user
            $user_id = wp_create_user($user->email, wp_generate_password(), $user->email);

            if (is_wp_error($user_id)) {
                echo "  - Error creating user {$user->email}: " . $user_id->get_error_message() . "\n";
                continue;
            }

            // Update user meta
            wp_update_user([
                'ID' => $user_id,
                'first_name' => $user->firstName ?? '',
                'last_name' => $user->lastName ?? '',
                'display_name' => ($user->firstName ?? '') . ' ' . ($user->lastName ?? ''),
            ]);

            // Add custom meta fields
            if (isset($user->phone)) {
                update_user_meta($user_id, 'hu_phone', $user->phone);
            }
            if (isset($user->bio)) {
                update_user_meta($user_id, 'hu_bio', $user->bio);
            }
            if (isset($user->location)) {
                update_user_meta($user_id, 'hu_location', $user->location);
            }
            if (isset($user->avatar)) {
                update_user_meta($user_id, 'hu_avatar', $user->avatar);
            }

            // Set user role
            $role = $user->role ?? 'subscriber';
            $user_obj = new WP_User($user_id);
            $user_obj->set_role($role);

            $count++;
            echo "  - Migrated user: {$user->email}\n";
        }

        $this->progress['users'] = $count;
        echo "✅ Migrated {$count} users\n\n";
    }

    /**
     * Migrate properties from MongoDB to WordPress
     */
    private function migrate_properties() {
        echo "🔄 Migrating properties...\n";

        $properties = $this->mongoDb->properties->find();
        $count = 0;

        foreach ($properties as $property) {
            // Create property post
            $post_data = [
                'post_title' => $property->title,
                'post_content' => $property->description ?? '',
                'post_type' => 'property',
                'post_status' => 'publish',
                'post_date' => isset($property->createdAt) ? date('Y-m-d H:i:s', strtotime($property->createdAt)) : current_time('mysql'),
            ];

            $post_id = wp_insert_post($post_data);

            if (is_wp_error($post_id)) {
                echo "  - Error creating property {$property->title}: " . $post_id->get_error_message() . "\n";
                continue;
            }

            // Add property meta fields
            $meta_fields = [
                'price' => $property->price ?? '',
                'address' => $property->address ?? '',
                'beds' => $property->beds ?? '',
                'baths' => $property->baths ?? '',
                'sqft' => $property->sqft ?? '',
                'year_built' => $property->yearBuilt ?? '',
                'lot_size' => $property->lotSize ?? '',
                'parking' => $property->parking ?? '',
                'featured' => $property->featured ? '1' : '0',
                'agent_id' => $this->find_agent_id($property->agentId ?? null),
            ];

            foreach ($meta_fields as $key => $value) {
                if (!empty($value)) {
                    update_post_meta($post_id, $key, $value);
                }
            }

            // Set taxonomies
            if (isset($property->type)) {
                wp_set_object_terms($post_id, $property->type, 'property_type');
            }
            if (isset($property->status)) {
                wp_set_object_terms($post_id, $property->status, 'property_status');
            }

            // Handle gallery images
            if (isset($property->images) && is_array($property->images)) {
                $gallery_ids = [];
                foreach ($property->images as $image_url) {
                    $attachment_id = $this->download_and_attach_image($image_url, $post_id);
                    if ($attachment_id) {
                        $gallery_ids[] = $attachment_id;
                    }
                }
                if (!empty($gallery_ids)) {
                    update_post_meta($post_id, 'gallery', implode(',', $gallery_ids));
                }
            }

            // Set featured image
            if (isset($property->featuredImage)) {
                $featured_id = $this->download_and_attach_image($property->featuredImage, $post_id);
                if ($featured_id) {
                    set_post_thumbnail($post_id, $featured_id);
                }
            }

            $count++;
            echo "  - Migrated property: {$property->title}\n";
        }

        $this->progress['properties'] = $count;
        echo "✅ Migrated {$count} properties\n\n";
    }

    /**
     * Migrate agents from MongoDB to WordPress
     */
    private function migrate_agents() {
        echo "🔄 Migrating agents...\n";

        $agents = $this->mongoDb->agents->find();
        $count = 0;

        foreach ($agents as $agent) {
            // Create agent post
            $post_data = [
                'post_title' => $agent->name,
                'post_content' => $agent->bio ?? '',
                'post_type' => 'agent',
                'post_status' => 'publish',
            ];

            $post_id = wp_insert_post($post_data);

            if (is_wp_error($post_id)) {
                echo "  - Error creating agent {$agent->name}: " . $post_id->get_error_message() . "\n";
                continue;
            }

            // Add agent meta fields
            $meta_fields = [
                'role' => $agent->role ?? '',
                'phone' => $agent->phone ?? '',
                'email' => $agent->email ?? '',
                'specialties' => $agent->specialties ?? '',
                'office_location' => $agent->officeLocation ?? '',
                'linkedin' => $agent->linkedin ?? '',
                'twitter' => $agent->twitter ?? '',
                'facebook' => $agent->facebook ?? '',
            ];

            foreach ($meta_fields as $key => $value) {
                if (!empty($value)) {
                    update_post_meta($post_id, $key, $value);
                }
            }

            // Set featured image (agent photo)
            if (isset($agent->photo)) {
                $photo_id = $this->download_and_attach_image($agent->photo, $post_id);
                if ($photo_id) {
                    set_post_thumbnail($post_id, $photo_id);
                }
            }

            $count++;
            echo "  - Migrated agent: {$agent->name}\n";
        }

        $this->progress['agents'] = $count;
        echo "✅ Migrated {$count} agents\n\n";
    }

    /**
     * Migrate blog posts from MongoDB to WordPress
     */
    private function migrate_blog_posts() {
        echo "🔄 Migrating blog posts...\n";

        $posts = $this->mongoDb->blogposts->find();
        $count = 0;

        foreach ($posts as $post) {
            // Create blog post
            $post_data = [
                'post_title' => $post->title,
                'post_content' => $post->content ?? '',
                'post_excerpt' => $post->excerpt ?? '',
                'post_type' => 'post',
                'post_status' => 'publish',
                'post_date' => isset($post->createdAt) ? date('Y-m-d H:i:s', strtotime($post->createdAt)) : current_time('mysql'),
            ];

            $post_id = wp_insert_post($post_data);

            if (is_wp_error($post_id)) {
                echo "  - Error creating blog post {$post->title}: " . $post_id->get_error_message() . "\n";
                continue;
            }

            // Set categories
            if (isset($post->categories) && is_array($post->categories)) {
                $category_ids = [];
                foreach ($post->categories as $category) {
                    $term = term_exists($category, 'category');
                    if (!$term) {
                        $term = wp_insert_term($category, 'category');
                    }
                    if (!is_wp_error($term)) {
                        $category_ids[] = $term['term_id'];
                    }
                }
                wp_set_post_categories($post_id, $category_ids);
            }

            // Set featured image
            if (isset($post->featuredImage)) {
                $image_id = $this->download_and_attach_image($post->featuredImage, $post_id);
                if ($image_id) {
                    set_post_thumbnail($post_id, $image_id);
                }
            }

            $count++;
            echo "  - Migrated blog post: {$post->title}\n";
        }

        $this->progress['blog_posts'] = $count;
        echo "✅ Migrated {$count} blog posts\n\n";
    }

    /**
     * Migrate inquiries from MongoDB to WordPress
     */
    private function migrate_inquiries() {
        echo "🔄 Migrating inquiries...\n";

        $inquiries = $this->mongoDb->inquiries->find();
        $count = 0;

        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';

        foreach ($inquiries as $inquiry) {
            $result = $wpdb->insert(
                $table,
                [
                    'property_id' => $this->find_property_id($inquiry->propertyId ?? null),
                    'user_id' => $this->find_user_id($inquiry->userId ?? null),
                    'name' => $inquiry->name ?? '',
                    'email' => $inquiry->email ?? '',
                    'phone' => $inquiry->phone ?? '',
                    'message' => $inquiry->message ?? '',
                    'inquiry_type' => $inquiry->type ?? 'general',
                    'status' => $inquiry->status ?? 'pending',
                    'created_at' => isset($inquiry->createdAt) ? date('Y-m-d H:i:s', strtotime($inquiry->createdAt)) : current_time('mysql'),
                ],
                ['%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
            );

            if ($result) {
                $count++;
                echo "  - Migrated inquiry from: {$inquiry->email}\n";
            }
        }

        $this->progress['inquiries'] = $count;
        echo "✅ Migrated {$count} inquiries\n\n";
    }

    /**
     * Migrate reviews from MongoDB to WordPress
     */
    private function migrate_reviews() {
        echo "🔄 Migrating reviews...\n";

        $reviews = $this->mongoDb->reviews->find();
        $count = 0;

        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';

        foreach ($reviews as $review) {
            $result = $wpdb->insert(
                $table,
                [
                    'property_id' => $this->find_property_id($review->propertyId ?? null),
                    'user_id' => $this->find_user_id($review->userId ?? null),
                    'rating' => $review->rating ?? 5,
                    'title' => $review->title ?? '',
                    'review' => $review->review ?? '',
                    'verified' => $review->verified ? 1 : 0,
                    'status' => $review->status ?? 'approved',
                    'created_at' => isset($review->createdAt) ? date('Y-m-d H:i:s', strtotime($review->createdAt)) : current_time('mysql'),
                    'updated_at' => isset($review->updatedAt) ? date('Y-m-d H:i:s', strtotime($review->updatedAt)) : current_time('mysql'),
                ],
                ['%d', '%d', '%d', '%s', '%s', '%d', '%s', '%s', '%s']
            );

            if ($result) {
                $count++;
                echo "  - Migrated review for property ID: {$review->propertyId}\n";
            }
        }

        $this->progress['reviews'] = $count;
        echo "✅ Migrated {$count} reviews\n\n";
    }

    /**
     * Migrate newsletter subscribers
     */
    private function migrate_newsletter_subscribers() {
        echo "🔄 Migrating newsletter subscribers...\n";

        $subscribers = $this->mongoDb->newsletters->find();
        $count = 0;

        foreach ($subscribers as $subscriber) {
            // Use a newsletter plugin like MailPoet or create custom table
            // For now, we'll create a simple custom table
            global $wpdb;
            $table = $wpdb->prefix . 'hu_newsletter_subscribers';

            // Create table if it doesn't exist
            $wpdb->query("CREATE TABLE IF NOT EXISTS $table (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                email varchar(255) NOT NULL,
                name varchar(255) DEFAULT '',
                subscribed_at datetime DEFAULT CURRENT_TIMESTAMP,
                status varchar(20) DEFAULT 'active',
                PRIMARY KEY (id),
                UNIQUE KEY email (email)
            )");

            $result = $wpdb->insert(
                $table,
                [
                    'email' => $subscriber->email,
                    'name' => $subscriber->name ?? '',
                    'status' => $subscriber->status ?? 'active',
                    'subscribed_at' => isset($subscriber->subscribedAt) ? date('Y-m-d H:i:s', strtotime($subscriber->subscribedAt)) : current_time('mysql'),
                ],
                ['%s', '%s', '%s', '%s']
            );

            if ($result) {
                $count++;
                echo "  - Migrated subscriber: {$subscriber->email}\n";
            }
        }

        $this->progress['subscribers'] = $count;
        echo "✅ Migrated {$count} newsletter subscribers\n\n";
    }

    /**
     * Helper function to find WordPress user ID by MongoDB user ID
     */
    private function find_user_id($mongo_user_id) {
        if (!$mongo_user_id) return null;

        // This would require storing a mapping or using email lookup
        // For simplicity, return null - you may need to implement proper mapping
        return null;
    }

    /**
     * Helper function to find WordPress property ID by MongoDB property ID
     */
    private function find_property_id($mongo_property_id) {
        if (!$mongo_property_id) return null;

        // This would require storing a mapping during migration
        // For simplicity, return null - you may need to implement proper mapping
        return null;
    }

    /**
     * Helper function to find WordPress agent ID by MongoDB agent ID
     */
    private function find_agent_id($mongo_agent_id) {
        if (!$mongo_agent_id) return null;

        // This would require storing a mapping during migration
        // For simplicity, return null - you may need to implement proper mapping
        return null;
    }

    /**
     * Download and attach image to WordPress
     */
    private function download_and_attach_image($image_url, $post_id) {
        if (empty($image_url)) return false;

        // Download image
        $response = wp_remote_get($image_url);
        if (is_wp_error($response)) return false;

        $image_data = wp_remote_retrieve_body($response);
        if (empty($image_data)) return false;

        // Get image info
        $filename = basename(parse_url($image_url, PHP_URL_PATH));
        $upload_dir = wp_upload_dir();
        $file_path = $upload_dir['path'] . '/' . $filename;

        // Save file
        if (!file_put_contents($file_path, $image_data)) return false;

        // Create attachment
        $attachment = [
            'guid' => $upload_dir['url'] . '/' . $filename,
            'post_mime_type' => wp_check_filetype($filename)['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', $filename),
            'post_content' => '',
            'post_status' => 'inherit'
        ];

        $attachment_id = wp_insert_attachment($attachment, $file_path, $post_id);
        if (is_wp_error($attachment_id)) return false;

        // Generate metadata
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attachment_data = wp_generate_attachment_metadata($attachment_id, $file_path);
        wp_update_attachment_metadata($attachment_id, $attachment_data);

        return $attachment_id;
    }

    /**
     * Show migration summary
     */
    private function show_summary() {
        echo "\n📊 Migration Summary:\n";
        echo "==================\n";
        foreach ($this->progress as $type => $count) {
            echo ucfirst(str_replace('_', ' ', $type)) . ": {$count}\n";
        }
        echo "\n🎉 All data has been migrated to WordPress!\n";
    }
}

// Run migration if accessed directly
if (isset($_GET['run_migration']) && current_user_can('manage_options')) {
    $migration = new HU_Data_Migration();
    $migration->run_migration();
} else {
    echo "<p><a href='?run_migration=1'>Click here to run the migration</a></p>";
    echo "<p><strong>Warning:</strong> This will migrate data from MongoDB to WordPress. Make sure you have a backup!</p>";
}