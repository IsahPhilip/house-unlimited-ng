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

    register_nav_menus([
        'primary' => __('Primary Menu', 'house-unlimited'),
        'footer' => __('Footer Menu', 'house-unlimited'),
    ]);
}
add_action('after_setup_theme', 'hu_theme_setup');

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
