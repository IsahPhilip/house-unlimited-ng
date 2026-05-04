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
