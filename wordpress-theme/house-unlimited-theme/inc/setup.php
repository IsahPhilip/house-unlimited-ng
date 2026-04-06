<?php
/**
 * Theme setup hooks.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

function hu_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);
    add_theme_support('custom-logo', [
        'height' => 80,
        'width' => 240,
        'flex-height' => true,
        'flex-width' => true,
    ]);
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_theme_support('elementor');
    add_theme_support('elementor-pro');

    register_nav_menus([
        'primary' => __('Primary Menu', 'house-unlimited'),
        'footer' => __('Footer Menu', 'house-unlimited'),
    ]);
}
add_action('after_setup_theme', 'hu_theme_setup');

/**
 * Allow Elementor on custom post types.
 */
function hu_elementor_cpt_support($post_types) {
    $post_types = is_array($post_types) ? $post_types : [];
    foreach (['property', 'agent'] as $type) {
        if (!in_array($type, $post_types, true)) {
            $post_types[] = $type;
        }
    }
    return $post_types;
}
add_filter('elementor_cpt_support', 'hu_elementor_cpt_support');

function hu_register_sidebars(): void
{
    register_sidebar([
        'name' => __('Footer Column 1', 'house-unlimited'),
        'id' => 'footer-1',
        'description' => __('First footer widget area.', 'house-unlimited'),
        'before_widget' => '<div class="hu-footer-widget">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="hu-footer-widget__title">',
        'after_title' => '</h3>',
    ]);

    register_sidebar([
        'name' => __('Footer Column 2', 'house-unlimited'),
        'id' => 'footer-2',
        'description' => __('Second footer widget area.', 'house-unlimited'),
        'before_widget' => '<div class="hu-footer-widget">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="hu-footer-widget__title">',
        'after_title' => '</h3>',
    ]);

    register_sidebar([
        'name' => __('Footer Column 3', 'house-unlimited'),
        'id' => 'footer-3',
        'description' => __('Third footer widget area.', 'house-unlimited'),
        'before_widget' => '<div class="hu-footer-widget">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="hu-footer-widget__title">',
        'after_title' => '</h3>',
    ]);
}
add_action('widgets_init', 'hu_register_sidebars');

/**
 * Normalize a price string into a numeric value.
 */
function hu_normalize_price_to_number($price) {
    if ($price === null || $price === '') {
        return null;
    }

    if (is_numeric($price)) {
        return (float) $price;
    }

    $clean = preg_replace('/[^0-9.]/', '', (string) $price);
    if ($clean === '' || !is_numeric($clean)) {
        return null;
    }

    return (float) $clean;
}

/**
 * Keep price_numeric in sync for properties.
 */
function hu_sync_property_price_numeric($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $price = get_post_meta($post_id, 'price', true);
    $numeric = hu_normalize_price_to_number($price);

    if ($numeric === null) {
        delete_post_meta($post_id, 'price_numeric');
        return;
    }

    update_post_meta($post_id, 'price_numeric', $numeric);
}
add_action('save_post_property', 'hu_sync_property_price_numeric');

/**
 * One-time backfill for existing properties.
 */
function hu_backfill_property_price_numeric() {
    if (!is_admin() || !current_user_can('manage_options')) {
        return;
    }

    if (get_option('hu_price_numeric_backfilled')) {
        return;
    }

    $posts = get_posts([
        'post_type' => 'property',
        'posts_per_page' => -1,
        'fields' => 'ids',
    ]);

    foreach ($posts as $post_id) {
        $price = get_post_meta($post_id, 'price', true);
        $numeric = hu_normalize_price_to_number($price);
        if ($numeric !== null) {
            update_post_meta($post_id, 'price_numeric', $numeric);
        }
    }

    update_option('hu_price_numeric_backfilled', 1);
}
add_action('admin_init', 'hu_backfill_property_price_numeric');

/**
 * Filter blog index by category query param.
 */
function hu_filter_blog_category_query($query) {
    if (!is_admin() && $query->is_main_query() && $query->is_home()) {
        if (!empty($_GET['category'])) {
            $slug = sanitize_text_field($_GET['category']);
            $category = get_category_by_slug($slug);
            if ($category) {
                $query->set('cat', $category->term_id);
            }
        }
    }
}
add_action('pre_get_posts', 'hu_filter_blog_category_query');

function hu_get_newsletter_table_name(): string
{
    global $wpdb;
    return $wpdb->prefix . 'hu_newsletter_subscribers';
}

function hu_newsletter_table_exists(): bool
{
    global $wpdb;
    $table = hu_get_newsletter_table_name();
    return $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table;
}

function hu_handle_newsletter_subscription(): void
{
    if (!isset($_POST['hu_newsletter_nonce']) || !wp_verify_nonce($_POST['hu_newsletter_nonce'], 'hu_newsletter_subscribe')) {
        wp_safe_redirect(add_query_arg('newsletter', 'security', wp_get_referer() ?: home_url('/')));
        exit;
    }

    $email = sanitize_email($_POST['newsletter_email'] ?? '');
    if (!$email || !is_email($email)) {
        wp_safe_redirect(add_query_arg('newsletter', 'invalid', wp_get_referer() ?: home_url('/')));
        exit;
    }

    $status = 'success';
    if (hu_newsletter_table_exists()) {
        global $wpdb;
        $table = hu_get_newsletter_table_name();
        $inserted = $wpdb->insert($table, [
            'email' => $email,
            'name' => sanitize_text_field($_POST['newsletter_name'] ?? ''),
            'status' => 'active',
            'subscribed_at' => current_time('mysql'),
        ]);
        if ($inserted === false) {
            if (strpos((string) $wpdb->last_error, 'Duplicate') !== false) {
                $status = 'exists';
            } else {
                $status = 'error';
            }
        }
    } else {
        // Fallback: still notify admin if table doesn't exist.
        wp_mail(get_option('admin_email'), 'New newsletter signup', "Email: {$email}");
    }

    wp_safe_redirect(add_query_arg('newsletter', $status, wp_get_referer() ?: home_url('/')));
    exit;
}
add_action('admin_post_hu_newsletter_subscribe', 'hu_handle_newsletter_subscription');
add_action('admin_post_nopriv_hu_newsletter_subscribe', 'hu_handle_newsletter_subscription');
