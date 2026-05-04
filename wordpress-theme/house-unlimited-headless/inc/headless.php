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
			'bedrooms'    => (int) hun_get_property_meta_value( $post->ID, 'bedrooms' ),
			'bathrooms'   => (int) hun_get_property_meta_value( $post->ID, 'bathrooms' ),
			'area'        => (string) hun_get_property_meta_value( $post->ID, 'area' ),
			'status'      => (string) hun_get_property_meta_value( $post->ID, 'property_status' ),
			'gallery'     => $gallery,
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

		if ( $host && ! in_array( $host, $hosts, true ) ) {
			$hosts[] = $host;
		}

		return $hosts;
	}
);

add_action(
	'template_redirect',
	static function () {
		if ( is_admin() || wp_doing_ajax() || wp_is_json_request() ) {
			return;
		}

		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
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
