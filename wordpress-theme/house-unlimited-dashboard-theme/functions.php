<?php
/**
 * Theme functions for House Unlimited Dashboard.
 *
 * @package HouseUnlimitedDashboard
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HUD_THEME_VERSION', '1.0.0');
define('HUD_THEME_DIR', get_template_directory());
define('HUD_THEME_URI', get_template_directory_uri());

function hud_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    register_nav_menus([
        'primary' => __('Primary Menu', 'house-unlimited-dashboard'),
    ]);
}
add_action('after_setup_theme', 'hud_theme_setup');

function hud_enqueue_assets(): void
{
    $css_dir = HUD_THEME_DIR . '/assets/css';
    if (is_dir($css_dir)) {
        $css_files = glob($css_dir . '/*.css') ?: [];
        foreach ($css_files as $css_file) {
            $handle = 'hud-' . sanitize_title(basename($css_file, '.css'));
            wp_enqueue_style(
                $handle,
                HUD_THEME_URI . '/assets/css/' . basename($css_file),
                [],
                HUD_THEME_VERSION
            );
        }
    }

    wp_enqueue_style(
        'hud-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap',
        [],
        null
    );
    wp_enqueue_style(
        'hud-fontawesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
        [],
        null
    );

    wp_enqueue_script(
        'hud-main',
        HUD_THEME_URI . '/assets/js/main.js',
        [],
        HUD_THEME_VERSION,
        true
    );

    wp_add_inline_script('hud-main', "window.BASE_URL = '" . esc_js(home_url()) . "';", 'before');
}
add_action('wp_enqueue_scripts', 'hud_enqueue_assets');

function hud_require_login(): void
{
    if (is_user_logged_in()) {
        return;
    }

    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($request_uri, 'wp-login.php') !== false || strpos($request_uri, 'wp-register.php') !== false) {
        return;
    }

    wp_safe_redirect(wp_login_url($request_uri));
    exit;
}
add_action('template_redirect', 'hud_require_login');

function hud_activate_theme(): void
{
    $page_title = 'Dashboard';
    $page_slug = 'dashboard';

    $page = get_page_by_path($page_slug);
    if (!$page) {
        $page_id = wp_insert_post([
            'post_title' => $page_title,
            'post_name' => $page_slug,
            'post_status' => 'publish',
            'post_type' => 'page',
        ]);

        if (!is_wp_error($page_id) && $page_id) {
            update_post_meta($page_id, '_wp_page_template', 'page-dashboard.php');
        }
    } else {
        update_post_meta($page->ID, '_wp_page_template', 'page-dashboard.php');
    }

    $page = get_page_by_path($page_slug);
    if ($page) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', (int) $page->ID);
    }
}
add_action('after_switch_theme', 'hud_activate_theme');

function hud_get_user_role_key(?WP_User $user = null): string
{
    $user = $user ?: wp_get_current_user();
    if (!$user || !$user->ID) {
        return 'guest';
    }

    if (user_can($user, 'administrator')) {
        return 'admin';
    }

    if (user_can($user, 'agent') || user_can($user, 'editor') || user_can($user, 'author')) {
        return 'agent';
    }

    return 'client';
}

function hud_get_user_display_name(?WP_User $user = null): string
{
    $user = $user ?: wp_get_current_user();
    if (!$user || !$user->ID) {
        return 'User';
    }

    $full_name = trim($user->first_name . ' ' . $user->last_name);
    if ($full_name !== '') {
        return $full_name;
    }

    return $user->display_name ?: 'User';
}
