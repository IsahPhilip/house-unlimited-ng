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

if ( ! function_exists( 'hun_blog_normalize_visitor_id' ) ) {
	/**
	 * Normalize a visitor identifier used for blog interactions.
	 */
	function hun_blog_normalize_visitor_id( string $visitor_id ): string {
		$visitor_id = sanitize_text_field( $visitor_id );
		$visitor_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $visitor_id );

		return is_string( $visitor_id ) ? $visitor_id : '';
	}
}

if ( ! function_exists( 'hun_blog_get_visitor_id_from_request' ) ) {
	/**
	 * Read the frontend visitor identifier from the request.
	 */
	function hun_blog_get_visitor_id_from_request( WP_REST_Request $request ): string {
		return hun_blog_normalize_visitor_id( (string) $request->get_param( 'visitorId' ) );
	}
}

if ( ! function_exists( 'hun_blog_get_visitor_list' ) ) {
	/**
	 * Read an array of visitor identifiers from post meta.
	 *
	 * @return string[]
	 */
	function hun_blog_get_visitor_list( int $post_id, string $meta_key ): array {
		$value = get_post_meta( $post_id, $meta_key, true );

		if ( ! is_array( $value ) ) {
			return array();
		}

		$values = array_map(
			static function ( $item ): string {
				return hun_blog_normalize_visitor_id( (string) $item );
			},
			$value
		);

		return array_values( array_unique( array_filter( $values ) ) );
	}
}

if ( ! function_exists( 'hun_blog_set_visitor_list' ) ) {
	/**
	 * Persist an array of visitor identifiers to post meta.
	 *
	 * @param string[] $visitor_ids
	 */
	function hun_blog_set_visitor_list( int $post_id, string $meta_key, array $visitor_ids ): void {
		update_post_meta( $post_id, $meta_key, array_values( array_unique( array_filter( $visitor_ids ) ) ) );
	}
}

if ( ! function_exists( 'hun_blog_increment_counter' ) ) {
	/**
	 * Increment a numeric post meta counter.
	 */
	function hun_blog_increment_counter( int $post_id, string $meta_key ): int {
		$current = (int) get_post_meta( $post_id, $meta_key, true );
		$current++;
		update_post_meta( $post_id, $meta_key, $current );

		return $current;
	}
}

if ( ! function_exists( 'hun_blog_get_counter' ) ) {
	/**
	 * Read a numeric post meta counter.
	 */
	function hun_blog_get_counter( int $post_id, string $meta_key ): int {
		return max( 0, (int) get_post_meta( $post_id, $meta_key, true ) );
	}
}

if ( ! function_exists( 'hun_blog_estimate_read_time' ) ) {
	/**
	 * Estimate a post read time from plain-text content.
	 */
	function hun_blog_estimate_read_time( string $content ): string {
		$words = str_word_count( wp_strip_all_tags( $content ) );
		$minutes = max( 1, (int) ceil( $words / 200 ) );

		return sprintf( '%d min read', $minutes );
	}
}

if ( ! function_exists( 'hun_blog_prepare_author_payload' ) ) {
	/**
	 * Prepare author details for the blog payload.
	 */
	function hun_blog_prepare_author_payload( WP_Post $post ): array {
		$user = get_user_by( 'id', (int) $post->post_author );
		$roles = array();

		if ( $user instanceof WP_User && ! empty( $user->roles ) ) {
			$roles = array_map(
				static function ( string $role ): string {
					return ucwords( str_replace( array( '_', '-' ), ' ', $role ) );
				},
				$user->roles
			);
		}

		return array(
			'name' => $user instanceof WP_User ? $user->display_name : get_the_author_meta( 'display_name', (int) $post->post_author ),
			'role' => ! empty( $roles ) ? implode( ', ', $roles ) : '',
			'image' => get_avatar_url( (int) $post->post_author, array( 'size' => 128 ) ) ?: '',
			'bio'  => $user instanceof WP_User ? (string) ( get_user_meta( $user->ID, 'hun_author_bio', true ) ?: $user->description ) : '',
		);
	}
}

if ( ! function_exists( 'hun_blog_prepare_post_payload' ) ) {
	/**
	 * Prepare an interactive blog post payload.
	 */
	function hun_blog_prepare_post_payload( WP_Post $post ): array {
		$content = apply_filters( 'the_content', $post->post_content );
		$categories = wp_get_post_terms( $post->ID, 'category', array( 'fields' => 'names' ) );
		$primary_category = ! empty( $categories ) ? (string) $categories[0] : 'Blog';
		$featured_image = get_the_post_thumbnail_url( $post, 'full' ) ?: '';

		return array(
			'id' => (string) $post->ID,
			'slug' => $post->post_name,
			'createdAt' => mysql_to_rfc3339( $post->post_date_gmt ?: $post->post_date ),
			'category' => $primary_category,
			'title' => get_the_title( $post ),
			'excerpt' => wp_strip_all_tags( get_the_excerpt( $post ) ),
			'content' => $content,
			'author' => hun_blog_prepare_author_payload( $post ),
			'image' => $featured_image ?: null,
			'readTime' => hun_blog_estimate_read_time( $content ),
			'views' => hun_blog_get_counter( $post->ID, '_hun_blog_views' ),
			'likes' => count( hun_blog_get_visitor_list( $post->ID, '_hun_blog_likes' ) ),
			'commentsCount' => (int) get_comments_number( $post->ID ),
		);
	}
}

if ( ! function_exists( 'hun_blog_prepare_comment_payload' ) ) {
	/**
	 * Prepare a public comment payload.
	 */
	function hun_blog_prepare_comment_payload( WP_Comment $comment ): array {
		$visitor_id = hun_blog_normalize_visitor_id( (string) get_comment_meta( $comment->comment_ID, 'hun_visitor_id', true ) );
		$created_at = mysql_to_rfc3339( $comment->comment_date_gmt ?: $comment->comment_date );
		$avatar = get_avatar_url( $comment->comment_author_email, array( 'size' => 96 ) );

		return array(
			'id' => (string) $comment->comment_ID,
			'content' => wp_strip_all_tags( $comment->comment_content ),
			'user' => array(
				'id' => $visitor_id ?: (string) $comment->user_id ?: (string) $comment->comment_ID,
				'name' => $comment->comment_author ? $comment->comment_author : __( 'Anonymous', 'house-unlimited-headless' ),
				'avatar' => $avatar ? $avatar : null,
				'role' => $comment->user_id ? 'Member' : '',
			),
			'createdAt' => $created_at,
			'updatedAt' => $created_at,
		);
	}
}

if ( ! function_exists( 'hun_blog_can_manage_comment' ) ) {
	/**
	 * Determine whether a visitor may edit or delete a comment.
	 */
	function hun_blog_can_manage_comment( WP_Comment $comment, string $visitor_id ): bool {
		if ( current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return true;
		}

		$comment_visitor_id = hun_blog_normalize_visitor_id( (string) get_comment_meta( $comment->comment_ID, 'hun_visitor_id', true ) );

		return $comment_visitor_id && $comment_visitor_id === $visitor_id;
	}
}

if ( ! function_exists( 'hun_blog_toggle_visitor_meta' ) ) {
	/**
	 * Toggle a visitor identifier in a post meta array.
	 *
	 * @return array{0: bool, 1: int}
	 */
	function hun_blog_toggle_visitor_meta( int $post_id, string $meta_key, string $visitor_id ): array {
		$visitor_list = hun_blog_get_visitor_list( $post_id, $meta_key );
		$is_present = in_array( $visitor_id, $visitor_list, true );

		if ( $is_present ) {
			$visitor_list = array_values( array_filter( $visitor_list, static function ( string $item ) use ( $visitor_id ): bool {
				return $item !== $visitor_id;
			} ) );
		} else {
			$visitor_list[] = $visitor_id;
		}

		hun_blog_set_visitor_list( $post_id, $meta_key, $visitor_list );

		return array( ! $is_present, count( $visitor_list ) );
	}
}

if ( ! function_exists( 'hun_blog_get_related_posts' ) ) {
	/**
	 * Fetch related blog posts by shared categories and tags.
	 *
	 * @return WP_Post[]
	 */
	function hun_blog_get_related_posts( int $post_id, int $limit = 3 ): array {
		$source_categories = wp_get_post_terms( $post_id, 'category', array( 'fields' => 'ids' ) );
		$source_tags = wp_get_post_terms( $post_id, 'post_tag', array( 'fields' => 'ids' ) );
		$posts = get_posts(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => 24,
				'post__not_in'   => array( $post_id ),
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		$scored_posts = array_map(
			static function ( WP_Post $post ) use ( $source_categories, $source_tags ): array {
				$categories = wp_get_post_terms( $post->ID, 'category', array( 'fields' => 'ids' ) );
				$tags = wp_get_post_terms( $post->ID, 'post_tag', array( 'fields' => 'ids' ) );
				$category_matches = count( array_intersect( $source_categories, $categories ) );
				$tag_matches = count( array_intersect( $source_tags, $tags ) );

				return array(
					'post'  => $post,
					'score' => ( $category_matches * 3 ) + ( $tag_matches * 2 ),
				);
			},
			$posts
		);

		usort(
			$scored_posts,
			static function ( array $left, array $right ): int {
				return $right['score'] <=> $left['score'];
			}
		);

		return array_slice(
			array_map(
				static function ( array $item ): WP_Post {
					return $item['post'];
				},
				$scored_posts
			),
			0,
			$limit
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
			'/blog/public/slug/(?P<slug>[a-zA-Z0-9-_]+)',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$posts = get_posts(
						array(
							'post_type'      => 'post',
							'name'           => sanitize_title( (string) $request['slug'] ),
							'post_status'    => 'publish',
							'posts_per_page' => 1,
						)
					);

					if ( empty( $posts[0] ) ) {
						return new WP_Error( 'hun_blog_post_not_found', __( 'Blog post not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
					}

					return rest_ensure_response( hun_blog_prepare_post_payload( $posts[0] ) );
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/blog/public/(?P<id>\d+)/related',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$post_id = absint( $request['id'] );
					$limit   = max( 1, min( 12, (int) $request->get_param( 'limit' ) ?: 3 ) );
					$posts   = hun_blog_get_related_posts( $post_id, $limit );

					return rest_ensure_response(
						array_map(
							static function ( WP_Post $post ): array {
								return hun_blog_prepare_post_payload( $post );
							},
							$posts
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/blog/public/(?P<id>\d+)/views',
			array(
				'methods'             => 'PATCH',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$post_id = absint( $request['id'] );

					if ( 'post' !== get_post_type( $post_id ) ) {
						return new WP_Error( 'hun_blog_post_not_found', __( 'Blog post not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
					}

					$views = hun_blog_increment_counter( $post_id, '_hun_blog_views' );

					return rest_ensure_response(
						array(
							'views' => $views,
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/blog/public/(?P<id>\d+)/interaction',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$post_id = absint( $request['id'] );
					$visitor_id = hun_blog_get_visitor_id_from_request( $request );

					return rest_ensure_response(
						array(
							'liked'      => $visitor_id ? in_array( $visitor_id, hun_blog_get_visitor_list( $post_id, '_hun_blog_likes' ), true ) : false,
							'bookmarked' => $visitor_id ? in_array( $visitor_id, hun_blog_get_visitor_list( $post_id, '_hun_blog_bookmarks' ), true ) : false,
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/blog/public/(?P<id>\d+)/like',
			array(
				'methods'             => array( 'POST', 'DELETE' ),
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$post_id = absint( $request['id'] );
					$visitor_id = hun_blog_get_visitor_id_from_request( $request );

					if ( ! $visitor_id ) {
						return new WP_Error( 'hun_blog_missing_visitor', __( 'A visitor identifier is required.', 'house-unlimited-headless' ), array( 'status' => 400 ) );
					}

					if ( 'post' !== get_post_type( $post_id ) ) {
						return new WP_Error( 'hun_blog_post_not_found', __( 'Blog post not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
					}

					$likes = hun_blog_get_visitor_list( $post_id, '_hun_blog_likes' );
					$is_liked = in_array( $visitor_id, $likes, true );

					if ( 'DELETE' === $request->get_method() ) {
						$likes = array_values( array_filter( $likes, static function ( string $item ) use ( $visitor_id ): bool {
							return $item !== $visitor_id;
						} ) );
						hun_blog_set_visitor_list( $post_id, '_hun_blog_likes', $likes );
						$is_liked = false;
					} elseif ( ! $is_liked ) {
						$likes[] = $visitor_id;
						hun_blog_set_visitor_list( $post_id, '_hun_blog_likes', $likes );
						$is_liked = true;
					}

					return rest_ensure_response(
						array(
							'liked' => $is_liked,
							'likes' => count( $likes ),
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/blog/public/(?P<id>\d+)/bookmark',
			array(
				'methods'             => array( 'POST', 'DELETE' ),
				'permission_callback' => '__return_true',
				'callback'            => static function ( WP_REST_Request $request ) {
					$post_id = absint( $request['id'] );
					$visitor_id = hun_blog_get_visitor_id_from_request( $request );

					if ( ! $visitor_id ) {
						return new WP_Error( 'hun_blog_missing_visitor', __( 'A visitor identifier is required.', 'house-unlimited-headless' ), array( 'status' => 400 ) );
					}

					if ( 'post' !== get_post_type( $post_id ) ) {
						return new WP_Error( 'hun_blog_post_not_found', __( 'Blog post not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
					}

					$bookmarks = hun_blog_get_visitor_list( $post_id, '_hun_blog_bookmarks' );
					$is_bookmarked = in_array( $visitor_id, $bookmarks, true );

					if ( 'DELETE' === $request->get_method() ) {
						$bookmarks = array_values( array_filter( $bookmarks, static function ( string $item ) use ( $visitor_id ): bool {
							return $item !== $visitor_id;
						} ) );
						hun_blog_set_visitor_list( $post_id, '_hun_blog_bookmarks', $bookmarks );
						$is_bookmarked = false;
					} elseif ( ! $is_bookmarked ) {
						$bookmarks[] = $visitor_id;
						hun_blog_set_visitor_list( $post_id, '_hun_blog_bookmarks', $bookmarks );
						$is_bookmarked = true;
					}

					return rest_ensure_response(
						array(
							'bookmarked' => $is_bookmarked,
						)
					);
				},
			)
		);

		register_rest_route(
			'hun/v1',
			'/blog/public/(?P<id>\d+)/comments',
			array(
				array(
					'methods'             => 'GET',
					'permission_callback' => '__return_true',
					'callback'            => static function ( WP_REST_Request $request ) {
						$post_id = absint( $request['id'] );

						if ( 'post' !== get_post_type( $post_id ) ) {
							return new WP_Error( 'hun_blog_post_not_found', __( 'Blog post not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
						}

						$comments = get_comments(
							array(
								'post_id' => $post_id,
								'status'  => 'approve',
								'orderby' => 'comment_date_gmt',
								'order'   => 'DESC',
								'number'  => 100,
							)
						);

						return rest_ensure_response(
							array_map(
								static function ( WP_Comment $comment ): array {
									return hun_blog_prepare_comment_payload( $comment );
								},
								$comments
							)
						);
					},
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => '__return_true',
					'callback'            => static function ( WP_REST_Request $request ) {
						$post_id = absint( $request['id'] );
						$visitor_id = hun_blog_get_visitor_id_from_request( $request );
						$content = sanitize_textarea_field( (string) $request->get_param( 'content' ) );
						$guest_name = sanitize_text_field( (string) $request->get_param( 'guestName' ) );
						$user_name = sanitize_text_field( (string) $request->get_param( 'userName' ) );

						if ( 'post' !== get_post_type( $post_id ) ) {
							return new WP_Error( 'hun_blog_post_not_found', __( 'Blog post not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
						}

						if ( '' === trim( $content ) ) {
							return new WP_Error( 'hun_blog_empty_comment', __( 'Comment content is required.', 'house-unlimited-headless' ), array( 'status' => 400 ) );
						}

						if ( '' === $visitor_id ) {
							return new WP_Error( 'hun_blog_missing_visitor', __( 'A visitor identifier is required.', 'house-unlimited-headless' ), array( 'status' => 400 ) );
						}

						$author_name = $user_name ?: ( $guest_name ?: __( 'Anonymous', 'house-unlimited-headless' ) );
						$author_email = sprintf( '%s@hun-comments.local', $visitor_id );

						$comment_id = wp_insert_comment(
							array(
								'comment_post_ID'      => $post_id,
								'comment_author'       => $author_name,
								'comment_author_email' => $author_email,
								'comment_content'      => $content,
								'comment_approved'     => 1,
							)
						);

						if ( ! $comment_id || is_wp_error( $comment_id ) ) {
							return new WP_Error( 'hun_blog_comment_failed', __( 'Unable to save the comment.', 'house-unlimited-headless' ), array( 'status' => 500 ) );
						}

						update_comment_meta( $comment_id, 'hun_visitor_id', $visitor_id );

						$comment = get_comment( $comment_id );

						if ( ! $comment instanceof WP_Comment ) {
							return new WP_Error( 'hun_blog_comment_missing', __( 'Unable to load the saved comment.', 'house-unlimited-headless' ), array( 'status' => 500 ) );
						}

						return rest_ensure_response( hun_blog_prepare_comment_payload( $comment ) );
					},
				),
			)
		);

		register_rest_route(
			'hun/v1',
			'/blog/public/comments/(?P<comment_id>\d+)',
			array(
				array(
					'methods'             => 'PUT',
					'permission_callback' => '__return_true',
					'callback'            => static function ( WP_REST_Request $request ) {
						$comment_id = absint( $request['comment_id'] );
						$visitor_id = hun_blog_get_visitor_id_from_request( $request );
						$content = sanitize_textarea_field( (string) $request->get_param( 'content' ) );
						$comment = get_comment( $comment_id );

						if ( ! $comment instanceof WP_Comment ) {
							return new WP_Error( 'hun_blog_comment_not_found', __( 'Comment not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
						}

						if ( ! hun_blog_can_manage_comment( $comment, $visitor_id ) ) {
							return new WP_Error( 'hun_blog_comment_forbidden', __( 'You do not have permission to update this comment.', 'house-unlimited-headless' ), array( 'status' => 403 ) );
						}

						if ( '' === trim( $content ) ) {
							return new WP_Error( 'hun_blog_empty_comment', __( 'Comment content is required.', 'house-unlimited-headless' ), array( 'status' => 400 ) );
						}

						$updated = wp_update_comment(
							array(
								'comment_ID'      => $comment_id,
								'comment_content' => $content,
							)
						);

						if ( ! $updated ) {
							return new WP_Error( 'hun_blog_comment_update_failed', __( 'Unable to update the comment.', 'house-unlimited-headless' ), array( 'status' => 500 ) );
						}

						$comment = get_comment( $comment_id );

						return rest_ensure_response( hun_blog_prepare_comment_payload( $comment ) );
					},
				),
				array(
					'methods'             => 'DELETE',
					'permission_callback' => '__return_true',
					'callback'            => static function ( WP_REST_Request $request ) {
						$comment_id = absint( $request['comment_id'] );
						$visitor_id = hun_blog_get_visitor_id_from_request( $request );
						$comment = get_comment( $comment_id );

						if ( ! $comment instanceof WP_Comment ) {
							return new WP_Error( 'hun_blog_comment_not_found', __( 'Comment not found.', 'house-unlimited-headless' ), array( 'status' => 404 ) );
						}

						if ( ! hun_blog_can_manage_comment( $comment, $visitor_id ) ) {
							return new WP_Error( 'hun_blog_comment_forbidden', __( 'You do not have permission to delete this comment.', 'house-unlimited-headless' ), array( 'status' => 403 ) );
						}

						$deleted = wp_delete_comment( $comment_id, true );

						if ( ! $deleted ) {
							return new WP_Error( 'hun_blog_comment_delete_failed', __( 'Unable to delete the comment.', 'house-unlimited-headless' ), array( 'status' => 500 ) );
						}

						return rest_ensure_response(
							array(
								'deleted' => true,
							)
						);
					},
				),
			)
		);

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
							'address'     => 'Suite S23 Febson Mall, Wuse Zone 4, Abuja 904101, Federal Capital Territory, Nigeria',
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
