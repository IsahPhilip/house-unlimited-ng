<?php
/**
 * House Unlimited Incremental Migration Script
 *
 * This script handles incremental data migration and rollback functionality
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}

require_once 'config.php';

class HU_Incremental_Migration {

    private $mongoClient;
    private $mongoDb;
    private $batch_size;

    public function __construct() {
        $this->batch_size = HU_MIGRATION_BATCH_SIZE;

        try {
            $this->mongoClient = new MongoDB\Client(hu_get_mongodb_connection_string());
            $this->mongoDb = $this->mongoClient->selectDatabase(HU_MONGODB_DATABASE);
        } catch (Exception $e) {
            hu_log_migration("Failed to connect to MongoDB: " . $e->getMessage(), 'error');
            die("Database connection failed");
        }
    }

    /**
     * Run incremental migration for a specific data type
     */
    public function run_incremental_migration($data_type, $batch_size = null) {
        if ($batch_size) {
            $this->batch_size = $batch_size;
        }

        hu_log_migration("Starting incremental migration for: $data_type");

        switch ($data_type) {
            case 'users':
                return $this->migrate_users_incremental();
            case 'properties':
                return $this->migrate_properties_incremental();
            case 'agents':
                return $this->migrate_agents_incremental();
            case 'blog_posts':
                return $this->migrate_blog_posts_incremental();
            case 'inquiries':
                return $this->migrate_inquiries_incremental();
            case 'reviews':
                return $this->migrate_reviews_incremental();
            case 'subscribers':
                return $this->migrate_subscribers_incremental();
            default:
                return ['error' => 'Unknown data type: ' . $data_type];
        }
    }

    /**
     * Incremental user migration
     */
    private function migrate_users_incremental() {
        $last_migrated_id = get_option('hu_last_migrated_user_id', null);
        $query = [];

        if ($last_migrated_id) {
            $query['_id'] = ['$gt' => new MongoDB\BSON\ObjectId($last_migrated_id)];
        }

        $users = $this->mongoDb->users->find($query, ['limit' => $this->batch_size]);
        $migrated = 0;
        $errors = 0;

        foreach ($users as $user) {
            try {
                $result = $this->migrate_single_user($user);
                if ($result) {
                    $migrated++;
                    update_option('hu_last_migrated_user_id', (string)$user->_id);
                } else {
                    $errors++;
                }
            } catch (Exception $e) {
                hu_log_migration("Error migrating user {$user->_id}: " . $e->getMessage(), 'error');
                $errors++;
            }
        }

        return [
            'migrated' => $migrated,
            'errors' => $errors,
            'last_id' => $last_migrated_id
        ];
    }

    /**
     * Incremental properties migration
     */
    private function migrate_properties_incremental() {
        $last_migrated_id = get_option('hu_last_migrated_property_id', null);
        $query = [];

        if ($last_migrated_id) {
            $query['_id'] = ['$gt' => new MongoDB\BSON\ObjectId($last_migrated_id)];
        }

        $properties = $this->mongoDb->properties->find($query, ['limit' => $this->batch_size]);
        $migrated = 0;
        $errors = 0;

        foreach ($properties as $property) {
            try {
                $result = $this->migrate_single_property($property);
                if ($result) {
                    $migrated++;
                    update_option('hu_last_migrated_property_id', (string)$property->_id);
                } else {
                    $errors++;
                }
            } catch (Exception $e) {
                hu_log_migration("Error migrating property {$property->_id}: " . $e->getMessage(), 'error');
                $errors++;
            }
        }

        return [
            'migrated' => $migrated,
            'errors' => $errors,
            'last_id' => $last_migrated_id
        ];
    }

    /**
     * Incremental agents migration
     */
    private function migrate_agents_incremental() {
        $last_migrated_id = get_option('hu_last_migrated_agent_id', null);
        $query = [];

        if ($last_migrated_id) {
            $query['_id'] = ['$gt' => new MongoDB\BSON\ObjectId($last_migrated_id)];
        }

        $agents = $this->mongoDb->agents->find($query, ['limit' => $this->batch_size]);
        $migrated = 0;
        $errors = 0;

        foreach ($agents as $agent) {
            try {
                $result = $this->migrate_single_agent($agent);
                if ($result) {
                    $migrated++;
                    update_option('hu_last_migrated_agent_id', (string)$agent->_id);
                } else {
                    $errors++;
                }
            } catch (Exception $e) {
                hu_log_migration("Error migrating agent {$agent->_id}: " . $e->getMessage(), 'error');
                $errors++;
            }
        }

        return [
            'migrated' => $migrated,
            'errors' => $errors,
            'last_id' => $last_migrated_id
        ];
    }

    /**
     * Incremental blog posts migration
     */
    private function migrate_blog_posts_incremental() {
        $last_migrated_id = get_option('hu_last_migrated_blog_post_id', null);
        $query = [];

        if ($last_migrated_id) {
            $query['_id'] = ['$gt' => new MongoDB\BSON\ObjectId($last_migrated_id)];
        }

        $posts = $this->mongoDb->blogposts->find($query, ['limit' => $this->batch_size]);
        $migrated = 0;
        $errors = 0;

        foreach ($posts as $post) {
            try {
                $result = $this->migrate_single_blog_post($post);
                if ($result) {
                    $migrated++;
                    update_option('hu_last_migrated_blog_post_id', (string)$post->_id);
                } else {
                    $errors++;
                }
            } catch (Exception $e) {
                hu_log_migration("Error migrating blog post {$post->_id}: " . $e->getMessage(), 'error');
                $errors++;
            }
        }

        return [
            'migrated' => $migrated,
            'errors' => $errors,
            'last_id' => $last_migrated_id
        ];
    }

    /**
     * Incremental inquiries migration
     */
    private function migrate_inquiries_incremental() {
        $last_migrated_id = get_option('hu_last_migrated_inquiry_id', null);
        $query = [];

        if ($last_migrated_id) {
            $query['_id'] = ['$gt' => new MongoDB\BSON\ObjectId($last_migrated_id)];
        }

        $inquiries = $this->mongoDb->inquiries->find($query, ['limit' => $this->batch_size]);
        $migrated = 0;
        $errors = 0;

        foreach ($inquiries as $inquiry) {
            try {
                $result = $this->migrate_single_inquiry($inquiry);
                if ($result) {
                    $migrated++;
                    update_option('hu_last_migrated_inquiry_id', (string)$inquiry->_id);
                } else {
                    $errors++;
                }
            } catch (Exception $e) {
                hu_log_migration("Error migrating inquiry {$inquiry->_id}: " . $e->getMessage(), 'error');
                $errors++;
            }
        }

        return [
            'migrated' => $migrated,
            'errors' => $errors,
            'last_id' => $last_migrated_id
        ];
    }

    /**
     * Incremental reviews migration
     */
    private function migrate_reviews_incremental() {
        $last_migrated_id = get_option('hu_last_migrated_review_id', null);
        $query = [];

        if ($last_migrated_id) {
            $query['_id'] = ['$gt' => new MongoDB\BSON\ObjectId($last_migrated_id)];
        }

        $reviews = $this->mongoDb->reviews->find($query, ['limit' => $this->batch_size]);
        $migrated = 0;
        $errors = 0;

        foreach ($reviews as $review) {
            try {
                $result = $this->migrate_single_review($review);
                if ($result) {
                    $migrated++;
                    update_option('hu_last_migrated_review_id', (string)$review->_id);
                } else {
                    $errors++;
                }
            } catch (Exception $e) {
                hu_log_migration("Error migrating review {$review->_id}: " . $e->getMessage(), 'error');
                $errors++;
            }
        }

        return [
            'migrated' => $migrated,
            'errors' => $errors,
            'last_id' => $last_migrated_id
        ];
    }

    /**
     * Incremental subscribers migration
     */
    private function migrate_subscribers_incremental() {
        $last_migrated_id = get_option('hu_last_migrated_subscriber_id', null);
        $query = [];

        if ($last_migrated_id) {
            $query['_id'] = ['$gt' => new MongoDB\BSON\ObjectId($last_migrated_id)];
        }

        $subscribers = $this->mongoDb->newsletters->find($query, ['limit' => $this->batch_size]);
        $migrated = 0;
        $errors = 0;

        foreach ($subscribers as $subscriber) {
            try {
                $result = $this->migrate_single_subscriber($subscriber);
                if ($result) {
                    $migrated++;
                    update_option('hu_last_migrated_subscriber_id', (string)$subscriber->_id);
                } else {
                    $errors++;
                }
            } catch (Exception $e) {
                hu_log_migration("Error migrating subscriber {$subscriber->_id}: " . $e->getMessage(), 'error');
                $errors++;
            }
        }

        return [
            'migrated' => $migrated,
            'errors' => $errors,
            'last_id' => $last_migrated_id
        ];
    }

    /**
     * Migrate single user
     */
    private function migrate_single_user($user) {
        // Skip if user already exists
        if (email_exists($user->email)) {
            return true; // Consider as migrated
        }

        // Create WordPress user
        $user_id = wp_create_user($user->email, wp_generate_password(), $user->email);

        if (is_wp_error($user_id)) {
            return false;
        }

        // Update user meta
        wp_update_user([
            'ID' => $user_id,
            'first_name' => $user->firstName ?? '',
            'last_name' => $user->lastName ?? '',
            'display_name' => ($user->firstName ?? '') . ' ' . ($user->lastName ?? ''),
        ]);

        // Add custom meta fields
        $meta_fields = ['phone', 'bio', 'location', 'avatar'];
        foreach ($meta_fields as $field) {
            if (isset($user->$field)) {
                update_user_meta($user_id, 'hu_' . $field, $user->$field);
            }
        }

        // Set user role
        $role = $user->role ?? HU_DEFAULT_USER_ROLE;
        $user_obj = new WP_User($user_id);
        $user_obj->set_role($role);

        return true;
    }

    /**
     * Migrate single property
     */
    private function migrate_single_property($property) {
        // Create property post
        $post_data = [
            'post_title' => $property->title,
            'post_content' => $property->description ?? '',
            'post_type' => 'property',
            'post_status' => HU_DEFAULT_PROPERTY_STATUS,
            'post_date' => isset($property->createdAt) ? date('Y-m-d H:i:s', strtotime($property->createdAt)) : current_time('mysql'),
        ];

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return false;
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

        return true;
    }

    /**
     * Migrate single agent
     */
    private function migrate_single_agent($agent) {
        // Create agent post
        $post_data = [
            'post_title' => $agent->name,
            'post_content' => $agent->bio ?? '',
            'post_type' => 'agent',
            'post_status' => 'publish',
        ];

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return false;
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

        return true;
    }

    /**
     * Migrate single blog post
     */
    private function migrate_single_blog_post($post) {
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
            return false;
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

        return true;
    }

    /**
     * Migrate single inquiry
     */
    private function migrate_single_inquiry($inquiry) {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';

        $result = $wpdb->insert(
            $table,
            [
                'property_id' => 0, // Will need proper mapping
                'user_id' => null,
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

        return $result !== false;
    }

    /**
     * Migrate single review
     */
    private function migrate_single_review($review) {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';

        $result = $wpdb->insert(
            $table,
            [
                'property_id' => 0, // Will need proper mapping
                'user_id' => null,
                'rating' => $review->rating ?? 5,
                'title' => $review->title ?? '',
                'review' => $review->review ?? '',
                'verified' => $review->verified ? 1 : 0,
                'status' => $review->status ?? HU_DEFAULT_REVIEW_STATUS,
                'created_at' => isset($review->createdAt) ? date('Y-m-d H:i:s', strtotime($review->createdAt)) : current_time('mysql'),
                'updated_at' => isset($review->updatedAt) ? date('Y-m-d H:i:s', strtotime($review->updatedAt)) : current_time('mysql'),
            ],
            ['%d', '%d', '%d', '%s', '%s', '%d', '%s', '%s', '%s']
        );

        return $result !== false;
    }

    /**
     * Migrate single subscriber
     */
    private function migrate_single_subscriber($subscriber) {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_newsletter_subscribers';

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

        return $result !== false;
    }

    /**
     * Rollback migration for a specific data type
     */
    public function rollback_migration($data_type) {
        hu_log_migration("Starting rollback for: $data_type");

        switch ($data_type) {
            case 'users':
                return $this->rollback_users();
            case 'properties':
                return $this->rollback_properties();
            case 'agents':
                return $this->rollback_agents();
            case 'blog_posts':
                return $this->rollback_blog_posts();
            case 'inquiries':
                return $this->rollback_inquiries();
            case 'reviews':
                return $this->rollback_reviews();
            case 'subscribers':
                return $this->rollback_subscribers();
            default:
                return ['error' => 'Unknown data type: ' . $data_type];
        }
    }

    /**
     * Rollback users
     */
    private function rollback_users() {
        // This is dangerous - only delete users created during migration
        // Implementation would require tracking which users were migrated
        return ['error' => 'User rollback not implemented for safety reasons'];
    }

    /**
     * Rollback properties
     */
    private function rollback_properties() {
        $deleted = 0;
        $posts = get_posts([
            'post_type' => 'property',
            'posts_per_page' => -1,
            'meta_query' => [
                [
                    'key' => 'hu_migrated',
                    'value' => '1',
                    'compare' => '='
                ]
            ]
        ]);

        foreach ($posts as $post) {
            wp_delete_post($post->ID, true);
            $deleted++;
        }

        delete_option('hu_last_migrated_property_id');
        return ['deleted' => $deleted];
    }

    /**
     * Rollback agents
     */
    private function rollback_agents() {
        $deleted = 0;
        $posts = get_posts([
            'post_type' => 'agent',
            'posts_per_page' => -1,
            'meta_query' => [
                [
                    'key' => 'hu_migrated',
                    'value' => '1',
                    'compare' => '='
                ]
            ]
        ]);

        foreach ($posts as $post) {
            wp_delete_post($post->ID, true);
            $deleted++;
        }

        delete_option('hu_last_migrated_agent_id');
        return ['deleted' => $deleted];
    }

    /**
     * Rollback blog posts
     */
    private function rollback_blog_posts() {
        $deleted = 0;
        $posts = get_posts([
            'post_type' => 'post',
            'posts_per_page' => -1,
            'meta_query' => [
                [
                    'key' => 'hu_migrated',
                    'value' => '1',
                    'compare' => '='
                ]
            ]
        ]);

        foreach ($posts as $post) {
            wp_delete_post($post->ID, true);
            $deleted++;
        }

        delete_option('hu_last_migrated_blog_post_id');
        return ['deleted' => $deleted];
    }

    /**
     * Rollback inquiries
     */
    private function rollback_inquiries() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';

        $deleted = $wpdb->query("DELETE FROM $table WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)");
        delete_option('hu_last_migrated_inquiry_id');

        return ['deleted' => $deleted];
    }

    /**
     * Rollback reviews
     */
    private function rollback_reviews() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';

        $deleted = $wpdb->query("DELETE FROM $table WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)");
        delete_option('hu_last_migrated_review_id');

        return ['deleted' => $deleted];
    }

    /**
     * Rollback subscribers
     */
    private function rollback_subscribers() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_newsletter_subscribers';

        $deleted = $wpdb->query("DELETE FROM $table WHERE subscribed_at > DATE_SUB(NOW(), INTERVAL 1 DAY)");
        delete_option('hu_last_migrated_subscriber_id');

        return ['deleted' => $deleted];
    }
}