<?php
/**
 * Wishlist functionality
 */

if (!defined('ABSPATH')) {
    exit;
}

class Wishlist {

    /**
     * Initialize wishlist functionality
     */
    public static function init() {
        // Add AJAX handlers
        add_action('wp_ajax_hu_add_to_wishlist', [__CLASS__, 'add_to_wishlist']);
        add_action('wp_ajax_hu_remove_from_wishlist', [__CLASS__, 'remove_from_wishlist']);
        add_action('wp_ajax_nopriv_hu_add_to_wishlist', [__CLASS__, 'add_to_wishlist']);
        add_action('wp_ajax_nopriv_hu_remove_from_wishlist', [__CLASS__, 'remove_from_wishlist']);

        // Add shortcode
        add_shortcode('hu_wishlist', [__CLASS__, 'wishlist_shortcode']);

        // Add user profile fields
        add_action('show_user_profile', [__CLASS__, 'add_wishlist_field']);
        add_action('edit_user_profile', [__CLASS__, 'add_wishlist_field']);
        add_action('personal_options_update', [__CLASS__, 'save_wishlist_field']);
        add_action('edit_user_profile_update', [__CLASS__, 'save_wishlist_field']);
    }

    /**
     * Add property to wishlist
     */
    public static function add_to_wishlist() {
        if (!is_user_logged_in()) {
            wp_send_json_error(['message' => 'Please log in to add to wishlist']);
            return;
        }

        $property_id = intval($_POST['property_id']);
        $user_id = get_current_user_id();

        if (!$property_id) {
            wp_send_json_error(['message' => 'Invalid property ID']);
            return;
        }

        $wishlist = get_user_meta($user_id, 'hu_wishlist', true);
        if (!is_array($wishlist)) {
            $wishlist = [];
        }

        if (!in_array($property_id, $wishlist)) {
            $wishlist[] = $property_id;
            update_user_meta($user_id, 'hu_wishlist', $wishlist);
            wp_send_json_success(['message' => 'Added to wishlist']);
        } else {
            wp_send_json_error(['message' => 'Already in wishlist']);
        }
    }

    /**
     * Remove property from wishlist
     */
    public static function remove_from_wishlist() {
        if (!is_user_logged_in()) {
            wp_send_json_error(['message' => 'Please log in to manage wishlist']);
            return;
        }

        $property_id = intval($_POST['property_id']);
        $user_id = get_current_user_id();

        $wishlist = get_user_meta($user_id, 'hu_wishlist', true);
        if (is_array($wishlist) && ($key = array_search($property_id, $wishlist)) !== false) {
            unset($wishlist[$key]);
            update_user_meta($user_id, 'hu_wishlist', array_values($wishlist));
            wp_send_json_success(['message' => 'Removed from wishlist']);
        } else {
            wp_send_json_error(['message' => 'Property not in wishlist']);
        }
    }

    /**
     * Get user's wishlist
     */
    public static function get_wishlist($user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        $wishlist = get_user_meta($user_id, 'hu_wishlist', true);
        return is_array($wishlist) ? $wishlist : [];
    }

    /**
     * Check if property is in wishlist
     */
    public static function is_in_wishlist($property_id, $user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        $wishlist = self::get_wishlist($user_id);
        return in_array($property_id, $wishlist);
    }

    /**
     * Wishlist shortcode
     */
    public static function wishlist_shortcode($atts) {
        if (!is_user_logged_in()) {
            return '<p>Please <a href="' . wp_login_url() . '">log in</a> to view your wishlist.</p>';
        }

        $atts = shortcode_atts([
            'limit' => -1,
        ], $atts);

        $user_id = get_current_user_id();
        $wishlist = self::get_wishlist($user_id);

        if (empty($wishlist)) {
            return '<p>Your wishlist is empty. <a href="' . get_post_type_archive_link('property') . '">Browse properties</a> to add some.</p>';
        }

        $query = new WP_Query([
            'post_type' => 'property',
            'post__in' => $wishlist,
            'posts_per_page' => $atts['limit'],
            'orderby' => 'post__in',
        ]);

        ob_start();

        if ($query->have_posts()) {
            echo '<div class="hu-wishlist">';
            echo '<h2>My Wishlist</h2>';
            echo '<div class="hu-property-grid">';

            while ($query->have_posts()) {
                $query->the_post();
                $price = get_post_meta(get_the_ID(), 'price', true);
                $address = get_post_meta(get_the_ID(), 'address', true);

                echo '<article class="hu-card hu-property-card">';
                echo '<a class="hu-property-card__image" href="' . get_permalink() . '">';
                if (has_post_thumbnail()) {
                    the_post_thumbnail('large');
                }
                echo '</a>';
                echo '<div class="hu-property-card__content">';
                if ($price) {
                    echo '<p class="hu-property-card__price">' . esc_html($price) . '</p>';
                }
                echo '<h3><a href="' . get_permalink() . '">' . get_the_title() . '</a></h3>';
                if ($address) {
                    echo '<p>' . esc_html($address) . '</p>';
                }
                echo '<button class="hu-remove-wishlist" data-property-id="' . get_the_ID() . '">Remove from Wishlist</button>';
                echo '</div>';
                echo '</article>';
            }

            echo '</div>';
            echo '</div>';
        }

        wp_reset_postdata();

        return ob_get_clean();
    }

    /**
     * Add wishlist field to user profile
     */
    public static function add_wishlist_field($user) {
        if (!current_user_can('manage_options')) {
            return;
        }

        $wishlist = get_user_meta($user->ID, 'hu_wishlist', true);
        if (!is_array($wishlist)) {
            $wishlist = [];
        }

        ?>
        <h3>Property Wishlist</h3>
        <table class="form-table">
            <tr>
                <th><label for="hu_wishlist">Wishlist Properties</label></th>
                <td>
                    <textarea name="hu_wishlist" id="hu_wishlist" rows="5" cols="30"><?php echo esc_textarea(implode(',', $wishlist)); ?></textarea>
                    <p class="description">Comma-separated property IDs</p>
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Save wishlist field
     */
    public static function save_wishlist_field($user_id) {
        if (!current_user_can('manage_options')) {
            return;
        }

        if (isset($_POST['hu_wishlist'])) {
            $wishlist = array_map('intval', array_filter(explode(',', sanitize_text_field($_POST['hu_wishlist']))));
            update_user_meta($user_id, 'hu_wishlist', $wishlist);
        }
    }
}