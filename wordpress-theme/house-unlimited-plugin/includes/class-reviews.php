<?php
/**
 * Property reviews functionality
 */

if (!defined('ABSPATH')) {
    exit;
}

class Reviews {

    /**
     * Initialize reviews functionality
     */
    public static function init() {
        // Add AJAX handlers
        add_action('wp_ajax_hu_submit_review', [__CLASS__, 'submit_review']);
        add_action('wp_ajax_hu_load_reviews', [__CLASS__, 'load_reviews']);
        add_action('wp_ajax_nopriv_hu_load_reviews', [__CLASS__, 'load_reviews']);

        // Add shortcode
        add_shortcode('hu_reviews', [__CLASS__, 'reviews_shortcode']);

        // Add admin menu
        add_action('admin_menu', [__CLASS__, 'add_admin_menu']);
    }

    /**
     * Submit review
     */
    public static function submit_review() {
        if (!is_user_logged_in()) {
            wp_send_json_error(['message' => 'Please log in to submit a review']);
            return;
        }

        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'hu_review_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
            return;
        }

        $property_id = intval($_POST['property_id']);
        $rating = intval($_POST['rating']);
        $title = sanitize_text_field($_POST['title']);
        $review = sanitize_textarea_field($_POST['review']);
        $user_id = get_current_user_id();

        if (!$property_id || !$rating || !$review) {
            wp_send_json_error(['message' => 'Please fill in all required fields']);
            return;
        }

        if ($rating < 1 || $rating > 5) {
            wp_send_json_error(['message' => 'Invalid rating']);
            return;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';

        $result = $wpdb->insert(
            $table,
            [
                'property_id' => $property_id,
                'user_id' => $user_id,
                'rating' => $rating,
                'title' => $title,
                'review' => $review,
                'status' => 'pending',
            ],
            ['%d', '%d', '%d', '%s', '%s', '%s']
        );

        if ($result) {
            wp_send_json_success(['message' => 'Review submitted for moderation']);
        } else {
            wp_send_json_error(['message' => 'Failed to submit review']);
        }
    }

    /**
     * Load reviews
     */
    public static function load_reviews() {
        $property_id = intval($_GET['property_id']);
        $page = intval($_GET['page']) ?: 1;
        $per_page = 5;

        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';

        $offset = ($page - 1) * $per_page;
        $reviews = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE property_id = %d AND status = 'approved' ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $property_id, $per_page, $offset
        ));

        $total_reviews = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE property_id = %d AND status = 'approved'",
            $property_id
        ));

        $response = [
            'reviews' => [],
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total_reviews / $per_page),
                'total_reviews' => $total_reviews,
            ]
        ];

        foreach ($reviews as $review) {
            $user = get_userdata($review->user_id);
            $response['reviews'][] = [
                'id' => $review->id,
                'rating' => $review->rating,
                'title' => $review->title,
                'review' => $review->review,
                'author' => $user ? $user->display_name : 'Anonymous',
                'date' => $review->created_at,
                'verified' => $review->verified,
            ];
        }

        wp_send_json_success($response);
    }

    /**
     * Reviews shortcode
     */
    public static function reviews_shortcode($atts) {
        $atts = shortcode_atts([
            'property_id' => get_the_ID(),
            'show_form' => true,
        ], $atts);

        $property_id = $atts['property_id'];

        ob_start();
        ?>
        <div class="hu-reviews" data-property-id="<?php echo esc_attr($property_id); ?>">
            <h3>Property Reviews</h3>

            <div id="hu-reviews-list">
                <!-- Reviews will be loaded here -->
            </div>

            <div id="hu-reviews-pagination"></div>

            <?php if ($atts['show_form'] && is_user_logged_in()) : ?>
                <div class="hu-review-form">
                    <h4>Write a Review</h4>
                    <form id="hu-review-form" method="post">
                        <?php wp_nonce_field('hu_review_nonce', 'hu_review_nonce'); ?>
                        <input type="hidden" name="property_id" value="<?php echo esc_attr($property_id); ?>">

                        <div class="hu-form-group">
                            <label>Rating *</label>
                            <div class="hu-rating-stars">
                                <?php for ($i = 5; $i >= 1; $i--) : ?>
                                    <input type="radio" id="star<?php echo $i; ?>" name="rating" value="<?php echo $i; ?>" required>
                                    <label for="star<?php echo $i; ?>"></label>
                                <?php endfor; ?>
                            </div>
                        </div>

                        <div class="hu-form-group">
                            <label for="review-title">Review Title</label>
                            <input type="text" id="review-title" name="title">
                        </div>

                        <div class="hu-form-group">
                            <label for="review-content">Your Review *</label>
                            <textarea id="review-content" name="review" rows="5" required></textarea>
                        </div>

                        <button type="submit" class="hu-button">Submit Review</button>
                    </form>
                    <div id="hu-review-response"></div>
                </div>
            <?php elseif (!is_user_logged_in()) : ?>
                <p>Please <a href="<?php echo wp_login_url(); ?>">log in</a> to write a review.</p>
            <?php endif; ?>
        </div>

        <script>
        jQuery(document).ready(function($) {
            function loadReviews(page = 1) {
                $.ajax({
                    url: '<?php echo admin_url('admin-ajax.php'); ?>',
                    type: 'GET',
                    data: {
                        action: 'hu_load_reviews',
                        property_id: <?php echo $property_id; ?>,
                        page: page
                    },
                    success: function(response) {
                        if (response.success) {
                            displayReviews(response.data.reviews);
                            displayPagination(response.data.pagination);
                        }
                    }
                });
            }

            function displayReviews(reviews) {
                var html = '';
                if (reviews.length === 0) {
                    html = '<p>No reviews yet. Be the first to review this property!</p>';
                } else {
                    reviews.forEach(function(review) {
                        html += '<div class="hu-review">';
                        html += '<div class="hu-review-header">';
                        html += '<div class="hu-review-rating">';
                        for (var i = 1; i <= 5; i++) {
                            html += '<span class="hu-star ' + (i <= review.rating ? 'filled' : '') + '">★</span>';
                        }
                        html += '</div>';
                        html += '<div class="hu-review-meta">';
                        html += '<strong>' + review.author + '</strong>';
                        html += '<time>' + review.date + '</time>';
                        html += '</div>';
                        html += '</div>';
                        if (review.title) {
                            html += '<h4>' + review.title + '</h4>';
                        }
                        html += '<p>' + review.review + '</p>';
                        html += '</div>';
                    });
                }
                $('#hu-reviews-list').html(html);
            }

            function displayPagination(pagination) {
                if (pagination.total_pages <= 1) {
                    $('#hu-reviews-pagination').empty();
                    return;
                }

                var html = '<div class="hu-pagination">';
                for (var i = 1; i <= pagination.total_pages; i++) {
                    html += '<button class="hu-page-btn ' + (i === pagination.current_page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
                }
                html += '</div>';
                $('#hu-reviews-pagination').html(html);
            }

            // Load initial reviews
            loadReviews();

            // Handle pagination
            $(document).on('click', '.hu-page-btn', function() {
                var page = $(this).data('page');
                loadReviews(page);
            });

            // Handle review submission
            $('#hu-review-form').on('submit', function(e) {
                e.preventDefault();

                var formData = $(this).serialize();

                $.ajax({
                    url: '<?php echo admin_url('admin-ajax.php'); ?>',
                    type: 'POST',
                    data: formData + '&action=hu_submit_review',
                    success: function(response) {
                        if (response.success) {
                            $('#hu-review-response').html('<p class="success">' + response.data.message + '</p>');
                            $('#hu-review-form')[0].reset();
                            loadReviews();
                        } else {
                            $('#hu-review-response').html('<p class="error">' + response.data.message + '</p>');
                        }
                    }
                });
            });
        });
        </script>
        <?php
        return ob_get_clean();
    }

    /**
     * Add admin menu
     */
    public static function add_admin_menu() {
        add_submenu_page(
            'hu-inquiries',
            'Property Reviews',
            'Reviews',
            'manage_options',
            'hu-reviews',
            [__CLASS__, 'admin_page']
        );
    }

    /**
     * Admin page
     */
    public static function admin_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';

        // Handle status updates
        if (isset($_GET['action']) && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $action = sanitize_text_field($_GET['action']);

            if ($action === 'approve') {
                $wpdb->update($table, ['status' => 'approved'], ['id' => $id]);
            } elseif ($action === 'reject') {
                $wpdb->update($table, ['status' => 'rejected'], ['id' => $id]);
            }
        }

        // Get reviews
        $reviews = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC");

        ?>
        <div class="wrap">
            <h1>Property Reviews</h1>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Author</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($reviews as $review) : ?>
                        <tr>
                            <td>
                                <a href="<?php echo get_permalink($review->property_id); ?>" target="_blank">
                                    <?php echo get_the_title($review->property_id); ?>
                                </a>
                            </td>
                            <td><?php echo get_userdata($review->user_id)->display_name; ?></td>
                            <td><?php echo str_repeat('★', $review->rating); ?></td>
                            <td><?php echo esc_html(ucfirst($review->status)); ?></td>
                            <td><?php echo esc_html($review->created_at); ?></td>
                            <td>
                                <?php if ($review->status === 'pending') : ?>
                                    <a href="?page=hu-reviews&action=approve&id=<?php echo $review->id; ?>">Approve</a> |
                                    <a href="?page=hu-reviews&action=reject&id=<?php echo $review->id; ?>">Reject</a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}