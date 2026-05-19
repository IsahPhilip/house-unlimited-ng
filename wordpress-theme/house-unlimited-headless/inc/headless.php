<?php
/**
 * Headless-specific helpers.
 *
 * @package house-unlimited-headless
 */

if ( ! function_exists( 'hun_headless_frontend_url' ) ) {
	/**
	 * Resolve the public frontend URL.
	 */
	function hun_headless_frontend_url(): string {
		if ( defined( 'HUN_HEADLESS_FRONTEND_URL' ) && HUN_HEADLESS_FRONTEND_URL ) {
			return untrailingslashit( HUN_HEADLESS_FRONTEND_URL );
		}

		$option = get_option( 'hun_headless_frontend_url' );

		if ( is_string( $option ) && $option ) {
			return untrailingslashit( $option );
		}

		return 'http://localhost:3000';
	}
}

if ( ! function_exists( 'hun_is_rest_like_request' ) ) {
	/**
	 * Detect requests that should never be redirected away from WordPress.
	 */
	function hun_is_rest_like_request(): bool {
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return true;
		}

		if ( function_exists( 'wp_is_json_request' ) && wp_is_json_request() ) {
			return true;
		}

		if ( isset( $_GET['rest_route'] ) ) {
			return true;
		}

		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';

		if ( '' !== $request_uri && false !== strpos( $request_uri, '/wp-json/' ) ) {
			return true;
		}

		return false;
	}
}

if ( ! function_exists( 'hun_wordpress_backend_url' ) ) {
	/**
	 * Resolve the canonical WordPress backend origin used for wp-admin and REST.
	 */
	function hun_wordpress_backend_url(): string {
		if ( defined( 'HUN_WORDPRESS_BACKEND_URL' ) && HUN_WORDPRESS_BACKEND_URL ) {
			return untrailingslashit( HUN_WORDPRESS_BACKEND_URL );
		}

		return untrailingslashit( site_url() );
	}
}

if ( ! function_exists( 'hun_sanitize_headless_frontend_url' ) ) {
	/**
	 * Normalize the saved frontend URL.
	 */
	function hun_sanitize_headless_frontend_url( $value ): string {
		$value = is_string( $value ) ? trim( $value ) : '';
		$value = esc_url_raw( $value );

		if ( '' === $value ) {
			return 'http://localhost:3000';
		}

		return untrailingslashit( $value );
	}
}

if ( ! function_exists( 'hun_get_property_meta_value' ) ) {
	/**
	 * Read a property field from ACF when available, then fall back to post meta.
	 *
	 * @param int    $post_id Property post ID.
	 * @param string $field   Field key.
	 */
	function hun_get_property_meta_value( int $post_id, string $field ) {
		if ( function_exists( 'get_field' ) ) {
			$value = get_field( $field, $post_id );

			if ( null !== $value && false !== $value && '' !== $value ) {
				return $value;
			}
		}

		return get_post_meta( $post_id, $field, true );
	}
}

if ( ! function_exists( 'hun_prepare_property_payload' ) ) {
	/**
	 * Normalize numeric meta values while preserving decimals.
	 *
	 * @param int    $post_id Property post ID.
	 * @param string $field   Field key.
	 */
	function hun_get_property_numeric_meta_value( int $post_id, string $field ) {
		$value = hun_get_property_meta_value( $post_id, $field );

		if ( '' === $value || null === $value || false === $value ) {
			return null;
		}

		if ( is_numeric( $value ) ) {
			$numeric = (float) $value;

			if ( floor( $numeric ) === $numeric ) {
				return (int) $numeric;
			}

			return $numeric;
		}

		return null;
	}

	/**
	 * Build a frontend-friendly property payload.
	 *
	 * @param WP_Post $post Property post object.
	 */
	function hun_prepare_property_payload( WP_Post $post ): array {
		$gallery = hun_get_property_meta_value( $post->ID, 'gallery' );
		$gallery = is_array( $gallery ) ? $gallery : array();
		$gallery = array_values(
			array_filter(
				array_map(
					static function ( $item ): string {
						if ( is_array( $item ) && ! empty( $item['url'] ) ) {
							return (string) $item['url'];
						}

						if ( is_numeric( $item ) ) {
							$url = wp_get_attachment_image_url( (int) $item, 'full' );

							return $url ? (string) $url : '';
						}

						return is_string( $item ) ? $item : '';
					},
					$gallery
				)
			)
		);

		return array(
			'id'          => $post->ID,
			'slug'        => $post->post_name,
			'title'       => get_the_title( $post ),
			'excerpt'     => has_excerpt( $post ) ? get_the_excerpt( $post ) : wp_trim_words( wp_strip_all_tags( $post->post_content ), 30 ),
			'content'     => apply_filters( 'the_content', $post->post_content ),
			'image'       => get_the_post_thumbnail_url( $post, 'large' ) ?: '',
			'price'       => (string) hun_get_property_meta_value( $post->ID, 'price' ),
			'type'        => (string) hun_get_property_meta_value( $post->ID, 'property_type' ),
			'location'    => (string) hun_get_property_meta_value( $post->ID, 'location' ),
			'bedrooms'    => hun_get_property_numeric_meta_value( $post->ID, 'bedrooms' ),
			'bathrooms'   => hun_get_property_numeric_meta_value( $post->ID, 'bathrooms' ),
			'area'        => (string) hun_get_property_meta_value( $post->ID, 'area' ),
			'status'      => (string) hun_get_property_meta_value( $post->ID, 'property_status' ),
			'gallery'     => $gallery,
		);
	}
}

if ( ! function_exists( 'hun_prepare_team_member_payload' ) ) {
	/**
	 * Build a frontend-friendly team member payload.
	 *
	 * @param WP_Post $post Team member post object.
	 */
	function hun_prepare_team_member_payload( WP_Post $post ): array {
		return array(
			'id'      => $post->ID,
			'slug'    => $post->post_name,
			'name'    => get_the_title( $post ),
			'role'    => has_excerpt( $post ) ? get_the_excerpt( $post ) : '',
			'bio'     => apply_filters( 'the_content', $post->post_content ),
			'image'   => get_the_post_thumbnail_url( $post, 'large' ) ?: '',
		);
	}
}

if ( ! function_exists( 'hun_prepare_testimonial_payload' ) ) {
	/**
	 * Build a frontend-friendly testimonial payload.
	 *
	 * @param WP_Post $post Testimonial post object.
	 */
	function hun_prepare_testimonial_payload( WP_Post $post ): array {
		return array(
			'id'       => $post->ID,
			'slug'     => $post->post_name,
			'name'     => get_the_title( $post ),
			'role'     => has_excerpt( $post ) ? get_the_excerpt( $post ) : __( 'Customer', 'house-unlimited-headless' ),
			'text'     => wp_strip_all_tags( $post->post_content ),
			'image'    => get_the_post_thumbnail_url( $post, 'thumbnail' ) ?: '',
		);
	}
}

if ( ! function_exists( 'hun_prepare_job_role_payload' ) ) {
	/**
	 * Build a frontend-friendly job role payload.
	 *
	 * @param WP_Post $post Job role post object.
	 */
	function hun_prepare_job_role_payload( WP_Post $post ): array {
		$employment_type = (string) hun_get_property_meta_value( $post->ID, 'employment_type' );
		$location        = (string) hun_get_property_meta_value( $post->ID, 'job_location' );
		$apply_label     = (string) hun_get_property_meta_value( $post->ID, 'apply_label' );

		return array(
			'id'             => $post->ID,
			'slug'           => $post->post_name,
			'title'          => get_the_title( $post ),
			'summary'        => has_excerpt( $post ) ? get_the_excerpt( $post ) : wp_trim_words( wp_strip_all_tags( $post->post_content ), 30 ),
			'content'        => apply_filters( 'the_content', $post->post_content ),
			'employmentType' => $employment_type ?: __( 'Full-time', 'house-unlimited-headless' ),
			'location'       => $location ?: __( 'Abuja, Nigeria', 'house-unlimited-headless' ),
			'applyLabel'     => $apply_label ?: __( 'Apply for this role', 'house-unlimited-headless' ),
		);
	}
}

if ( ! function_exists( 'hun_prepare_featured_video_payload' ) ) {
	/**
	 * Build a frontend-friendly featured video payload.
	 *
	 * @param WP_Post $post Featured video post object.
	 */
	function hun_prepare_featured_video_payload( WP_Post $post ): array {
		$video_url = (string) hun_get_property_meta_value( $post->ID, 'video_url' );

		return array(
			'id'       => $post->ID,
			'slug'     => $post->post_name,
			'title'    => get_the_title( $post ),
			'url'      => $video_url,
			'image'    => get_the_post_thumbnail_url( $post, 'large' ) ?: '',
		);
	}
}

add_action(
	'admin_init',
	static function () {
		if ( false === get_option( 'hun_headless_frontend_url', false ) ) {
			add_option( 'hun_headless_frontend_url', 'http://localhost:3000', '', false );
		}

		register_setting(
			'reading',
			'hun_headless_frontend_url',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'hun_sanitize_headless_frontend_url',
				'default'           => 'http://localhost:3000',
			)
		);

		add_settings_field(
			'hun_headless_frontend_url',
			__( 'Headless Frontend URL', 'house-unlimited-headless' ),
			static function () {
				printf(
					'<input type="url" class="regular-text code" name="hun_headless_frontend_url" value="%s" />',
					esc_attr( hun_headless_frontend_url() )
				);
			},
			'reading'
		);
	}
);

add_filter(
	'allowed_redirect_hosts',
	static function ( array $hosts ): array {
		$host = wp_parse_url( hun_headless_frontend_url(), PHP_URL_HOST );
		$backend_host = wp_parse_url( hun_wordpress_backend_url(), PHP_URL_HOST );

		if ( $host && ! in_array( $host, $hosts, true ) ) {
			$hosts[] = $host;
		}

		if ( $backend_host && ! in_array( $backend_host, $hosts, true ) ) {
			$hosts[] = $backend_host;
		}

		return $hosts;
	}
);

add_filter(
	'rest_url',
	static function ( string $url, string $path, $blog_id, string $scheme ): string {
		if ( ! is_admin() ) {
			return $url;
		}

		$backend_origin = hun_wordpress_backend_url();

		if ( '' === $backend_origin ) {
			return $url;
		}

		$current_host = wp_parse_url( $backend_origin, PHP_URL_HOST );
		$rest_host    = wp_parse_url( $url, PHP_URL_HOST );

		if ( ! $current_host || ! $rest_host || $current_host === $rest_host ) {
			return $url;
		}

		$rest_path  = wp_parse_url( $url, PHP_URL_PATH );
		$rest_query = wp_parse_url( $url, PHP_URL_QUERY );
		$rest_query = is_string( $rest_query ) && '' !== $rest_query ? '?' . $rest_query : '';

		return untrailingslashit( $backend_origin ) . $rest_path . $rest_query;
	},
	10,
	4
);

add_action(
	'template_redirect',
	static function () {
		if ( is_admin() || wp_doing_ajax() || hun_is_rest_like_request() ) {
			return;
		}

		if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
			return;
		}

		$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
		$request_path = trim( (string) wp_parse_url( $request_uri, PHP_URL_PATH ), '/' );
		$target_path  = $request_path ? '/' . $request_path . '/' : '/';
		$query_string = (string) wp_parse_url( $request_uri, PHP_URL_QUERY );
		$query_string = $query_string ? '?' . $query_string : '';

		wp_safe_redirect( hun_headless_frontend_url() . $target_path . $query_string, 302 );
		exit;
	}
);

add_filter(
	'preview_post_link',
	static function ( string $link, WP_Post $post ): string {
		$post_type = get_post_type( $post );
		$frontend  = hun_headless_frontend_url();

		if ( 'post' === $post_type ) {
			return sprintf(
				'%s/blog/%s?preview=true&p=%d',
				$frontend,
				$post->post_name,
				$post->ID
			);
		}

		return sprintf(
			'%s/%s/%s?preview=true&p=%d',
			$frontend,
			$post_type,
			$post->post_name,
			$post->ID
		);
	},
	10,
	2
);

add_action(
	'rest_api_init',
	static function () {
		register_rest_route(
			'hun/v1',
			'/settings',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function () {
					return rest_ensure_response(
						array(
							'frontendUrl' => hun_headless_frontend_url(),
							'graphqlUrl'  => home_url( '/graphql' ),
							'siteUrl'     => home_url( '/' ),
							'phone'       => '+234 904 375 2708',
							'email'       => 'official@houseunlimitednigeria.com',
							'address'     => 'Abuja, Nigeria',
							'facebook'    => 'https://facebook.com/houseunlimitednigeria',
							'instagram'   => 'https://instagram.com/houseunlimitednigeria',
							'linkedin'    => 'https://linkedin.com/company/houseunlimitednigeria',
							'youtube'     => 'https://youtube.com/@houseunlimitednigeria',
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/menu',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function () {
					$locations = get_nav_menu_locations();
					$menu_id   = $locations['primary'] ?? 0;
					$items     = array();

					if ( $menu_id ) {
						$menu_items = wp_get_nav_menu_items( $menu_id );

						if ( is_array( $menu_items ) ) {
							foreach ( $menu_items as $menu_item ) {
								if ( ! empty( $menu_item->menu_item_parent ) ) {
									continue;
								}

								$path = wp_parse_url( $menu_item->url, PHP_URL_PATH );
								$path = is_string( $path ) && $path ? $path : '/';

								$items[] = array(
									'label' => $menu_item->title,
									'path'  => untrailingslashit( $path ) ?: '/',
								);
							}
						}
					}

					return rest_ensure_response(
						array(
							'items' => $items,
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/properties',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$per_page = max( 1, min( 24, (int) $request->get_param( 'per_page' ) ?: 6 ) );
					$posts    = get_posts(
						array(
							'post_type'      => 'property',
							'post_status'    => 'publish',
							'posts_per_page' => $per_page,
							'orderby'        => 'date',
							'order'          => 'DESC',
						)
					);

					return rest_ensure_response(
						array(
							'items' => array_map( 'hun_prepare_property_payload', $posts ),
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/properties/(?P<slug>[a-zA-Z0-9-_]+)',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$posts = get_posts(
						array(
							'post_type'      => 'property',
							'name'           => sanitize_title( (string) $request['slug'] ),
							'post_status'    => 'publish',
							'posts_per_page' => 1,
						)
					);

					if ( empty( $posts[0] ) ) {
						return new WP_Error( 'hun_property_not_found', __( 'Property not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
					}

					return rest_ensure_response( hun_prepare_property_payload( $posts[0] ) );
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/team',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$per_page = max( 1, min( 24, (int) $request->get_param( 'per_page' ) ?: 8 ) );
					$posts    = get_posts(
						array(
							'post_type'      => 'team_member',
							'post_status'    => 'publish',
							'posts_per_page' => $per_page,
							'orderby'        => array(
								'menu_order' => 'ASC',
								'date'       => 'DESC',
							),
						)
					);

					return rest_ensure_response(
						array(
							'items' => array_map( 'hun_prepare_team_member_payload', $posts ),
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/testimonials',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$per_page = max( 1, min( 24, (int) $request->get_param( 'per_page' ) ?: 6 ) );
					$posts    = get_posts(
						array(
							'post_type'      => 'testimonial',
							'post_status'    => 'publish',
							'posts_per_page' => $per_page,
							'orderby'        => array(
								'menu_order' => 'ASC',
								'date'       => 'DESC',
							),
						)
					);

					return rest_ensure_response(
						array(
							'items' => array_map( 'hun_prepare_testimonial_payload', $posts ),
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/job-roles',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$per_page = max( 1, min( 24, (int) $request->get_param( 'per_page' ) ?: 12 ) );
					$posts    = get_posts(
						array(
							'post_type'      => 'job_role',
							'post_status'    => 'publish',
							'posts_per_page' => $per_page,
							'orderby'        => array(
								'menu_order' => 'ASC',
								'date'       => 'DESC',
							),
						)
					);

					return rest_ensure_response(
						array(
							'items' => array_map( 'hun_prepare_job_role_payload', $posts ),
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/featured-videos',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$per_page = max( 1, min( 24, (int) $request->get_param( 'per_page' ) ?: 4 ) );
					$posts    = get_posts(
						array(
							'post_type'      => 'featured_video',
							'post_status'    => 'publish',
							'posts_per_page' => $per_page,
							'orderby'        => array(
								'menu_order' => 'ASC',
								'date'       => 'DESC',
							),
						)
					);

					return rest_ensure_response(
						array(
							'items' => array_map( 'hun_prepare_featured_video_payload', $posts ),
						)
					);
				},
			)
		);
	}
);

add_action(
	'graphql_register_types',
	static function () {
		if ( ! function_exists( 'register_graphql_field' ) ) {
			return;
		}

		register_graphql_field(
			'GeneralSettings',
			'headlessFrontendUrl',
			array(
				'type'        => 'String',
				'description' => __( 'Public URL for the decoupled frontend.', 'house-unlimited-headless' ),
				'resolve'     => static function (): string {
					return hun_headless_frontend_url();
				},
			)
		);
	}
);