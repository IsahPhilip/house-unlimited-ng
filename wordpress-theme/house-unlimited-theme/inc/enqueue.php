<?php
/**
 * Asset loading.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

function hu_enqueue_assets(): void
{
    wp_enqueue_script(
        'house-unlimited-tailwind',
        'https://cdn.tailwindcss.com',
        [],
        null,
        false
    );

    wp_enqueue_style(
        'house-unlimited-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'house-unlimited-style',
        get_stylesheet_uri(),
        ['house-unlimited-fonts'],
        HU_THEME_VERSION
    );

    wp_enqueue_style(
        'house-unlimited-main',
        HU_THEME_URI . '/assets/css/main.css',
        ['house-unlimited-style'],
        HU_THEME_VERSION
    );

    wp_enqueue_script(
        'house-unlimited-lucide',
        'https://unpkg.com/lucide@latest',
        [],
        null,
        true
    );

    wp_enqueue_script(
        'house-unlimited-theme',
        HU_THEME_URI . '/assets/js/theme.js',
        [],
        HU_THEME_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'hu_enqueue_assets');
