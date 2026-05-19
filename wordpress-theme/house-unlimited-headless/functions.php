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
	'init',
	static function () {
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

		register_post_type(
			'team_member',
			array(
				'labels'              => array(
					'name'               => __( 'Team Members', 'house-unlimited-headless' ),
					'singular_name'      => __( 'Team Member', 'house-unlimited-headless' ),
					'add_new_item'       => __( 'Add New Team Member', 'house-unlimited-headless' ),
					'edit_item'          => __( 'Edit Team Member', 'house-unlimited-headless' ),
					'new_item'           => __( 'New Team Member', 'house-unlimited-headless' ),
					'view_item'          => __( 'View Team Member', 'house-unlimited-headless' ),
					'search_items'       => __( 'Search Team Members', 'house-unlimited-headless' ),
					'not_found'          => __( 'No team members found', 'house-unlimited-headless' ),
					'not_found_in_trash' => __( 'No team members found in trash', 'house-unlimited-headless' ),
				),
				'public'              => true,
				'publicly_queryable'  => true,
				'exclude_from_search' => true,
				'has_archive'         => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => false,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'TeamMember',
				'graphql_plural_name' => 'TeamMembers',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
				'menu_icon'           => 'dashicons-groups',
				'rewrite'             => false,
			)
		);

		register_post_type(
			'testimonial',
			array(
				'labels'              => array(
					'name'               => __( 'Testimonials', 'house-unlimited-headless' ),
					'singular_name'      => __( 'Testimonial', 'house-unlimited-headless' ),
					'add_new_item'       => __( 'Add New Testimonial', 'house-unlimited-headless' ),
					'edit_item'          => __( 'Edit Testimonial', 'house-unlimited-headless' ),
					'new_item'           => __( 'New Testimonial', 'house-unlimited-headless' ),
					'view_item'          => __( 'View Testimonial', 'house-unlimited-headless' ),
					'search_items'       => __( 'Search Testimonials', 'house-unlimited-headless' ),
					'not_found'          => __( 'No testimonials found', 'house-unlimited-headless' ),
					'not_found_in_trash' => __( 'No testimonials found in trash', 'house-unlimited-headless' ),
				),
				'public'              => true,
				'publicly_queryable'  => true,
				'exclude_from_search' => true,
				'has_archive'         => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => false,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'Testimonial',
				'graphql_plural_name' => 'Testimonials',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
				'menu_icon'           => 'dashicons-format-quote',
				'rewrite'             => false,
			)
		);

		register_post_type(
			'job_role',
			array(
				'labels'              => array(
					'name'               => __( 'Job Roles', 'house-unlimited-headless' ),
					'singular_name'      => __( 'Job Role', 'house-unlimited-headless' ),
					'add_new_item'       => __( 'Add New Job Role', 'house-unlimited-headless' ),
					'edit_item'          => __( 'Edit Job Role', 'house-unlimited-headless' ),
					'new_item'           => __( 'New Job Role', 'house-unlimited-headless' ),
					'view_item'          => __( 'View Job Role', 'house-unlimited-headless' ),
					'search_items'       => __( 'Search Job Roles', 'house-unlimited-headless' ),
					'not_found'          => __( 'No job roles found', 'house-unlimited-headless' ),
					'not_found_in_trash' => __( 'No job roles found in trash', 'house-unlimited-headless' ),
				),
				'public'              => true,
				'publicly_queryable'  => true,
				'exclude_from_search' => true,
				'has_archive'         => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => false,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'JobRole',
				'graphql_plural_name' => 'JobRoles',
				'supports'            => array( 'title', 'editor', 'excerpt', 'page-attributes' ),
				'menu_icon'           => 'dashicons-businessperson',
				'rewrite'             => false,
			)
		);

		register_post_type(
			'featured_video',
			array(
				'labels'              => array(
					'name'               => __( 'Featured Videos', 'house-unlimited-headless' ),
					'singular_name'      => __( 'Featured Video', 'house-unlimited-headless' ),
					'add_new_item'       => __( 'Add New Featured Video', 'house-unlimited-headless' ),
					'edit_item'          => __( 'Edit Featured Video', 'house-unlimited-headless' ),
					'new_item'           => __( 'New Featured Video', 'house-unlimited-headless' ),
					'view_item'          => __( 'View Featured Video', 'house-unlimited-headless' ),
					'search_items'       => __( 'Search Featured Videos', 'house-unlimited-headless' ),
					'not_found'          => __( 'No featured videos found', 'house-unlimited-headless' ),
					'not_found_in_trash' => __( 'No featured videos found in trash', 'house-unlimited-headless' ),
				),
				'public'              => true,
				'publicly_queryable'  => true,
				'exclude_from_search' => true,
				'has_archive'         => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => false,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'FeaturedVideo',
				'graphql_plural_name' => 'FeaturedVideos',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
				'menu_icon'           => 'dashicons-video-alt3',
				'rewrite'             => false,
			)
		);
	}
);

add_action(
	'init',
	static function () {
		if ( function_exists( 'acf_add_local_field_group' ) ) {
			acf_add_local_field_group( array(
				'key'                   => 'group_featured_video_fields',
				'title'                 => 'Featured Video Fields',
				'fields'                => array(
					array(
						'key'               => 'field_video_url',
						'label'             => 'Video URL',
						'name'              => 'video_url',
						'type'              => 'url',
						'instructions'      => 'Enter the YouTube, Vimeo URL, or direct video file URL (.mp4, .webm, etc.)',
						'required'          => true,
					),
				),
				'location'              => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => 'featured_video',
						),
					),
				),
				'show_in_graphql'       => true,
				'graphql_field_name'    => 'featuredVideoFields',
			) );

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

			acf_add_local_field_group( array(
				'key'                => 'group_job_role_fields',
				'title'              => 'Job Role Fields',
				'fields'             => array(
					array(
						'key'   => 'field_job_role_type',
						'label' => 'Employment Type',
						'name'  => 'employment_type',
						'type'  => 'text',
					),
					array(
						'key'   => 'field_job_role_location',
						'label' => 'Location',
						'name'  => 'job_location',
						'type'  => 'text',
					),
					array(
						'key'   => 'field_job_role_apply_label',
						'label' => 'Apply Button Label',
						'name'  => 'apply_label',
						'type'  => 'text',
					),
				),
				'location'           => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => 'job_role',
						),
					),
				),
				'show_in_graphql'    => true,
				'graphql_field_name' => 'jobRoleFields',
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

/**
 * Increase the image size threshold for WordPress image processing.
 * WordPress automatically scales down images larger than 2560px.
 * This raises the threshold to allow larger uploads without "server cannot process" errors.
 */
add_filter(
	'big_image_size_threshold',
	static function ( int $threshold ): int {
		return 3840; // Allow images up to 3840px (4K)
	}
);


/**
 * Increase PHP memory limit for image processing during uploads.
 */
add_filter(
	'wp_handle_upload_prefilter',
	static function ( array $file ): array {
		$image_info = getimagesize( $file['tmp_name'] );

		if ( false !== $image_info ) {
			$width  = $image_info[0];
			$height = $image_info[1];

			// If the image is very large, increase memory limit for processing
			if ( $width > 4000 || $height > 4000 ) {
				if ( function_exists( 'wp_raise_memory_limit' ) ) {
					wp_raise_memory_limit( 'image' );
				}
			}
		}

		return $file;
	}
);
