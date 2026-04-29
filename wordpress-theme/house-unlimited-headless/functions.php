<?php
/**
 * Theme bootstrap for the headless WordPress install.
 *
 * @package house-unlimited-headless
 */

define( 'HUN_HEADLESS_THEME_VERSION', '0.1.0' );

require_once get_template_directory() . '/inc/headless.php';

add_action(
	'after_setup_theme',
	static function () {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_theme_support( 'editor-styles' );

		register_nav_menus(
			array(
				'primary' => __( 'Primary Menu', 'house-unlimited-headless' ),
				'footer'  => __( 'Footer Menu', 'house-unlimited-headless' ),
			)
		);
	}
);

add_action(
	'wp_enqueue_scripts',
	static function () {
		wp_enqueue_style(
			'house-unlimited-headless-theme',
			get_stylesheet_uri(),
			array(),
			HUN_HEADLESS_THEME_VERSION
		);
	}
);
