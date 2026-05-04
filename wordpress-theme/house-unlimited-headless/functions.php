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

		// Register Property Custom Post Type for GraphQL
		register_post_type(
			'property',
			array(
				'labels'             => array(
					'name'               => __( 'Properties', 'house-unlimited-headless' ),
					'singular_name'      => __( 'Property', 'house-unlimited-headless' ),
					'add_new'            => __( 'Add New Property', 'house-unlimited-headless' ),
					'add_new_item'       => __( 'Add New Property', 'house-unlimited-headless' ),
					'edit_item'          => __( 'Edit Property', 'house-unlimited-headless' ),
					'new_item'           => __( 'New Property', 'house-unlimited-headless' ),
					'view_item'          => __( 'View Property', 'house-unlimited-headless' ),
					'search_items'       => __( 'Search Properties', 'house-unlimited-headless' ),
					'not_found'          => __( 'No properties found', 'house-unlimited-headless' ),
					'not_found_in_trash' => __( 'No properties found in trash', 'house-unlimited-headless' ),
				),
				'public'             => true,
				'has_archive'        => true,
				'show_in_rest'       => true,
				'show_in_graphql'    => true,
				'graphql_single_name' => 'Property',
				'graphql_plural_name' => 'Properties',
				'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
				'menu_icon'          => 'dashicons-building',
				'rewrite'            => array( 'slug' => 'properties' ),
			)
		);

		// Register Property Fields for ACF if using ACF
		if ( function_exists( 'acf_add_local_field_group' ) ) {
			acf_add_local_field_group( array(
				'key'                   => 'group_property_fields',
				'title'                 => 'Property Fields',
				'fields'                => array(
					array(
						'key'               => 'field_price',
						'label'             => 'Price',
						'name'              => 'price',
						'type'              => 'text',
					),
					array(
						'key'               => 'field_property_type',
						'label'             => 'Property Type',
						'name'              => 'property_type',
						'type'              => 'text',
					),
					array(
						'key'               => 'field_location',
						'label'             => 'Location',
						'name'              => 'location',
						'type'              => 'text',
					),
					array(
						'key'               => 'field_bedrooms',
						'label'             => 'Bedrooms',
						'name'              => 'bedrooms',
						'type'              => 'number',
					),
					array(
						'key'               => 'field_bathrooms',
						'label'             => 'Bathrooms',
						'name'              => 'bathrooms',
						'type'              => 'number',
					),
					array(
						'key'               => 'field_area',
						'label'             => 'Area',
						'name'              => 'area',
						'type'              => 'text',
					),
					array(
						'key'               => 'field_property_status',
						'label'             => 'Property Status',
						'name'              => 'property_status',
						'type'              => 'text',
					),
					array(
						'key'               => 'field_gallery',
						'label'             => 'Gallery',
						'name'              => 'gallery',
						'type'              => 'gallery',
					),
				),
				'location'              => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => 'property',
						),
					),
				),
				'show_in_graphql'       => true,
				'graphql_field_name'    => 'propertyFields',
			) );
		}
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
