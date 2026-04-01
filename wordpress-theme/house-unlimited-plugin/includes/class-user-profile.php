<?php
/**
 * Enhanced user profile functionality
 */

if (!defined('ABSPATH')) {
    exit;
}

class User_Profile {

    /**
     * Initialize user profile functionality
     */
    public static function init() {
        // Add user profile fields
        add_action('show_user_profile', [__CLASS__, 'add_user_fields']);
        add_action('edit_user_profile', [__CLASS__, 'add_user_fields']);
        add_action('personal_options_update', [__CLASS__, 'save_user_fields']);
        add_action('edit_user_profile_update', [__CLASS__, 'save_user_fields']);

        // Add account page
        add_action('init', [__CLASS__, 'add_account_rewrite_rules']);
        add_filter('query_vars', [__CLASS__, 'add_account_query_vars']);
        add_action('template_redirect', [__CLASS__, 'account_page_template']);

        // Add avatar upload
        add_action('wp_ajax_hu_upload_avatar', [__CLASS__, 'upload_avatar']);

        // Add profile update handler
        add_action('admin_post_hu_update_profile', [__CLASS__, 'update_profile']);
    }

    /**
     * Add user profile fields
     */
    public static function add_user_fields($user) {
        ?>
        <h3>Additional Information</h3>
        <table class="form-table">
            <tr>
                <th><label for="hu_phone">Phone Number</label></th>
                <td>
                    <input type="tel" name="hu_phone" id="hu_phone" value="<?php echo esc_attr(get_user_meta($user->ID, 'hu_phone', true)); ?>" class="regular-text">
                </td>
            </tr>
            <tr>
                <th><label for="hu_bio">Bio</label></th>
                <td>
                    <textarea name="hu_bio" id="hu_bio" rows="5" cols="30"><?php echo esc_textarea(get_user_meta($user->ID, 'hu_bio', true)); ?></textarea>
                </td>
            </tr>
            <tr>
                <th><label for="hu_location">Location</label></th>
                <td>
                    <input type="text" name="hu_location" id="hu_location" value="<?php echo esc_attr(get_user_meta($user->ID, 'hu_location', true)); ?>" class="regular-text">
                </td>
            </tr>
            <tr>
                <th><label for="hu_notification_preferences">Notification Preferences</label></th>
                <td>
                    <label>
                        <input type="checkbox" name="hu_email_notifications" value="1" <?php checked(get_user_meta($user->ID, 'hu_email_notifications', true), '1'); ?>>
                        Receive email notifications
                    </label>
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Save user profile fields
     */
    public static function save_user_fields($user_id) {
        if (!current_user_can('edit_user', $user_id)) {
            return;
        }

        update_user_meta($user_id, 'hu_phone', sanitize_text_field($_POST['hu_phone']));
        update_user_meta($user_id, 'hu_bio', sanitize_textarea_field($_POST['hu_bio']));
        update_user_meta($user_id, 'hu_location', sanitize_text_field($_POST['hu_location']));
        update_user_meta($user_id, 'hu_email_notifications', isset($_POST['hu_email_notifications']) ? '1' : '0');
    }

    /**
     * Add rewrite rules for account page
     */
    public static function add_account_rewrite_rules() {
        add_rewrite_rule('^my-account/?$', 'index.php?hu_account=1', 'top');
        add_rewrite_rule('^my-account/([^/]+)/?$', 'index.php?hu_account=1&hu_account_tab=$matches[1]', 'top');
    }

    /**
     * Add query vars
     */
    public static function add_account_query_vars($vars) {
        $vars[] = 'hu_account';
        $vars[] = 'hu_account_tab';
        return $vars;
    }

    /**
     * Account page template
     */
    public static function account_page_template() {
        if (get_query_var('hu_account')) {
            if (!is_user_logged_in()) {
                wp_redirect(wp_login_url(home_url('/my-account')));
                exit;
            }

            get_header();

            $current_tab = get_query_var('hu_account_tab', 'overview');
            $tabs = [
                'overview' => 'Overview',
                'wishlist' => 'My Wishlist',
                'reviews' => 'My Reviews',
                'profile' => 'Profile Settings',
            ];

            ?>
            <section class="hu-account-page">
                <div class="hu-container">
                    <h1>My Account</h1>

                    <div class="hu-account-tabs">
                        <?php foreach ($tabs as $tab_key => $tab_name) : ?>
                            <a href="<?php echo home_url('/my-account/' . $tab_key); ?>" class="hu-account-tab <?php echo $current_tab === $tab_key ? 'active' : ''; ?>">
                                <?php echo esc_html($tab_name); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>

                    <div class="hu-account-content">
                        <?php
                        switch ($current_tab) {
                            case 'wishlist':
                                echo do_shortcode('[hu_wishlist]');
                                break;
                            case 'reviews':
                                self::display_user_reviews();
                                break;
                            case 'profile':
                                self::display_profile_form();
                                break;
                            default:
                                self::display_account_overview();
                                break;
                        }
                        ?>
                    </div>
                </div>
            </section>
            <?php

            get_footer();
            exit;
        }
    }

    /**
     * Display account overview
     */
    private static function display_account_overview() {
        $user = wp_get_current_user();
        $wishlist_count = count(Wishlist::get_wishlist());
        $reviews_count = self::get_user_reviews_count();

        ?>
        <div class="hu-account-overview">
            <div class="hu-overview-stats">
                <div class="hu-stat-card">
                    <h3><?php echo $wishlist_count; ?></h3>
                    <p>Properties in Wishlist</p>
                </div>
                <div class="hu-stat-card">
                    <h3><?php echo $reviews_count; ?></h3>
                    <p>Reviews Submitted</p>
                </div>
            </div>

            <div class="hu-account-info">
                <h3>Account Information</h3>
                <p><strong>Name:</strong> <?php echo esc_html($user->display_name); ?></p>
                <p><strong>Email:</strong> <?php echo esc_html($user->user_email); ?></p>
                <p><strong>Phone:</strong> <?php echo esc_html(get_user_meta($user->ID, 'hu_phone', true) ?: 'Not provided'); ?></p>
                <p><strong>Location:</strong> <?php echo esc_html(get_user_meta($user->ID, 'hu_location', true) ?: 'Not provided'); ?></p>
            </div>
        </div>
        <?php
    }

    /**
     * Display user reviews
     */
    private static function display_user_reviews() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';
        $user_id = get_current_user_id();

        $reviews = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE user_id = %d ORDER BY created_at DESC",
            $user_id
        ));

        if (empty($reviews)) {
            echo '<p>You haven\'t submitted any reviews yet.</p>';
            return;
        }

        echo '<div class="hu-user-reviews">';
        foreach ($reviews as $review) {
            $property = get_post($review->property_id);
            echo '<div class="hu-review-item">';
            echo '<h4><a href="' . get_permalink($property) . '">' . esc_html($property->post_title) . '</a></h4>';
            echo '<div class="hu-review-rating">' . str_repeat('★', $review->rating) . '</div>';
            if ($review->title) {
                echo '<h5>' . esc_html($review->title) . '</h5>';
            }
            echo '<p>' . esc_html($review->review) . '</p>';
            echo '<small>Status: ' . esc_html(ucfirst($review->status)) . ' | ' . esc_html($review->created_at) . '</small>';
            echo '</div>';
        }
        echo '</div>';
    }

    /**
     * Display profile form
     */
    private static function display_profile_form() {
        $user = wp_get_current_user();

        ?>
        <form method="post" action="<?php echo admin_url('admin-post.php'); ?>" enctype="multipart/form-data">
            <?php wp_nonce_field('hu_update_profile', 'hu_profile_nonce'); ?>
            <input type="hidden" name="action" value="hu_update_profile">

            <div class="hu-form-group">
                <label for="first_name">First Name</label>
                <input type="text" name="first_name" id="first_name" value="<?php echo esc_attr($user->first_name); ?>">
            </div>

            <div class="hu-form-group">
                <label for="last_name">Last Name</label>
                <input type="text" name="last_name" id="last_name" value="<?php echo esc_attr($user->last_name); ?>">
            </div>

            <div class="hu-form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" value="<?php echo esc_attr($user->user_email); ?>">
            </div>

            <div class="hu-form-group">
                <label for="hu_phone">Phone</label>
                <input type="tel" name="hu_phone" id="hu_phone" value="<?php echo esc_attr(get_user_meta($user->ID, 'hu_phone', true)); ?>">
            </div>

            <div class="hu-form-group">
                <label for="hu_bio">Bio</label>
                <textarea name="hu_bio" id="hu_bio" rows="5"><?php echo esc_textarea(get_user_meta($user->ID, 'hu_bio', true)); ?></textarea>
            </div>

            <div class="hu-form-group">
                <label for="hu_location">Location</label>
                <input type="text" name="hu_location" id="hu_location" value="<?php echo esc_attr(get_user_meta($user->ID, 'hu_location', true)); ?>">
            </div>

            <div class="hu-form-group">
                <label for="hu_avatar">Profile Picture</label>
                <input type="file" name="hu_avatar" id="hu_avatar" accept="image/*">
                <?php if ($avatar = get_user_meta($user->ID, 'hu_avatar', true)) : ?>
                    <img src="<?php echo esc_url($avatar); ?>" alt="Current avatar" style="max-width: 100px; margin-top: 10px;">
                <?php endif; ?>
            </div>

            <button type="submit" class="hu-button">Update Profile</button>
        </form>
        <?php
    }

    /**
     * Get user reviews count
     */
    private static function get_user_reviews_count() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';
        $user_id = get_current_user_id();

        return $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE user_id = %d",
            $user_id
        ));
    }

    /**
     * Handle avatar upload
     */
    public static function upload_avatar() {
        if (!is_user_logged_in()) {
            wp_send_json_error(['message' => 'Please log in']);
            return;
        }

        if (!function_exists('wp_handle_upload')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
        }

        $files = $_FILES['hu_avatar'];
        $upload_overrides = ['test_form' => false];

        $movefile = wp_handle_upload($files, $upload_overrides);

        if ($movefile && !isset($movefile['error'])) {
            update_user_meta(get_current_user_id(), 'hu_avatar', $movefile['url']);
            wp_send_json_success(['message' => 'Avatar uploaded successfully', 'url' => $movefile['url']]);
        } else {
            wp_send_json_error(['message' => $movefile['error']]);
        }
    }

    /**
     * Update user profile
     */
    public static function update_profile() {
        if (!is_user_logged_in()) {
            wp_die('Unauthorized');
        }

        if (!wp_verify_nonce($_POST['hu_profile_nonce'], 'hu_update_profile')) {
            wp_die('Security check failed');
        }

        $user_id = get_current_user_id();
        $user_data = [];

        // Update basic user info
        if (isset($_POST['first_name'])) {
            $user_data['first_name'] = sanitize_text_field($_POST['first_name']);
        }
        if (isset($_POST['last_name'])) {
            $user_data['last_name'] = sanitize_text_field($_POST['last_name']);
        }
        if (isset($_POST['email'])) {
            $user_data['user_email'] = sanitize_email($_POST['email']);
        }

        if (!empty($user_data)) {
            $user_data['ID'] = $user_id;
            wp_update_user($user_data);
        }

        // Update custom fields
        if (isset($_POST['hu_phone'])) {
            update_user_meta($user_id, 'hu_phone', sanitize_text_field($_POST['hu_phone']));
        }
        if (isset($_POST['hu_bio'])) {
            update_user_meta($user_id, 'hu_bio', sanitize_textarea_field($_POST['hu_bio']));
        }
        if (isset($_POST['hu_location'])) {
            update_user_meta($user_id, 'hu_location', sanitize_text_field($_POST['hu_location']));
        }

        // Handle avatar upload
        if (!empty($_FILES['hu_avatar']['name'])) {
            if (!function_exists('wp_handle_upload')) {
                require_once(ABSPATH . 'wp-admin/includes/file.php');
            }

            $files = $_FILES['hu_avatar'];
            $upload_overrides = ['test_form' => false];

            $movefile = wp_handle_upload($files, $upload_overrides);

            if ($movefile && !isset($movefile['error'])) {
                update_user_meta($user_id, 'hu_avatar', $movefile['url']);
            }
        }

        wp_redirect(home_url('/my-account/profile?updated=1'));
        exit;
    }
}