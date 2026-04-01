<?php
/**
 * Property inquiries functionality
 */

if (!defined('ABSPATH')) {
    exit;
}

class Inquiries {

    /**
     * Initialize inquiries functionality
     */
    public static function init() {
        // Add AJAX handlers
        add_action('wp_ajax_hu_submit_inquiry', [__CLASS__, 'submit_inquiry']);
        add_action('wp_ajax_nopriv_hu_submit_inquiry', [__CLASS__, 'submit_inquiry']);

        // Add admin menu
        add_action('admin_menu', [__CLASS__, 'add_admin_menu']);

        // Add shortcode
        add_shortcode('hu_inquiry_form', [__CLASS__, 'inquiry_form_shortcode']);
    }

    /**
     * Submit inquiry
     */
    public static function submit_inquiry() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'hu_inquiry_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
            return;
        }

        $property_id = intval($_POST['property_id']);
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $phone = sanitize_text_field($_POST['phone']);
        $message = sanitize_textarea_field($_POST['message']);
        $inquiry_type = sanitize_text_field($_POST['inquiry_type']);

        if (!$property_id || !$name || !$email || !$message) {
            wp_send_json_error(['message' => 'Please fill in all required fields']);
            return;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';

        $result = $wpdb->insert(
            $table,
            [
                'property_id' => $property_id,
                'user_id' => get_current_user_id(),
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'message' => $message,
                'inquiry_type' => $inquiry_type,
                'status' => 'pending',
            ],
            ['%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s']
        );

        if ($result) {
            // Send notification email
            self::send_inquiry_notification($property_id, $name, $email, $message);

            wp_send_json_success(['message' => 'Inquiry submitted successfully']);
        } else {
            wp_send_json_error(['message' => 'Failed to submit inquiry']);
        }
    }

    /**
     * Send inquiry notification
     */
    private static function send_inquiry_notification($property_id, $name, $email, $message) {
        $property = get_post($property_id);
        $admin_email = get_option('admin_email');

        $subject = sprintf('New Property Inquiry: %s', $property->post_title);
        $body = sprintf(
            "New inquiry received:\n\nProperty: %s\nName: %s\nEmail: %s\n\nMessage:\n%s\n\nView property: %s",
            $property->post_title,
            $name,
            $email,
            $message,
            get_permalink($property_id)
        );

        wp_mail($admin_email, $subject, $body);
    }

    /**
     * Inquiry form shortcode
     */
    public static function inquiry_form_shortcode($atts) {
        $atts = shortcode_atts([
            'property_id' => get_the_ID(),
        ], $atts);

        if (get_post_type() !== 'property' && !$atts['property_id']) {
            return '<p>Inquiry form is only available on property pages.</p>';
        }

        $property_id = $atts['property_id'];
        $property = get_post($property_id);

        if (!$property) {
            return '<p>Invalid property.</p>';
        }

        ob_start();
        ?>
        <div class="hu-inquiry-form">
            <h3>Inquire About This Property</h3>
            <form id="hu-inquiry-form" method="post">
                <?php wp_nonce_field('hu_inquiry_nonce', 'hu_inquiry_nonce'); ?>
                <input type="hidden" name="property_id" value="<?php echo esc_attr($property_id); ?>">

                <div class="hu-form-group">
                    <label for="inquiry-name">Name *</label>
                    <input type="text" id="inquiry-name" name="name" required>
                </div>

                <div class="hu-form-group">
                    <label for="inquiry-email">Email *</label>
                    <input type="email" id="inquiry-email" name="email" required>
                </div>

                <div class="hu-form-group">
                    <label for="inquiry-phone">Phone</label>
                    <input type="tel" id="inquiry-phone" name="phone">
                </div>

                <div class="hu-form-group">
                    <label for="inquiry-type">Inquiry Type</label>
                    <select id="inquiry-type" name="inquiry_type">
                        <option value="general">General Inquiry</option>
                        <option value="pricing">Pricing Question</option>
                        <option value="availability">Availability</option>
                        <option value="viewing">Schedule Viewing</option>
                    </select>
                </div>

                <div class="hu-form-group">
                    <label for="inquiry-message">Message *</label>
                    <textarea id="inquiry-message" name="message" rows="5" required></textarea>
                </div>

                <button type="submit" class="hu-button hu-button--primary">Send Inquiry</button>
            </form>
            <div id="hu-inquiry-response"></div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            $('#hu-inquiry-form').on('submit', function(e) {
                e.preventDefault();

                var formData = $(this).serialize();

                $.ajax({
                    url: '<?php echo admin_url('admin-ajax.php'); ?>',
                    type: 'POST',
                    data: formData + '&action=hu_submit_inquiry',
                    success: function(response) {
                        if (response.success) {
                            $('#hu-inquiry-response').html('<p class="success">' + response.data.message + '</p>');
                            $('#hu-inquiry-form')[0].reset();
                        } else {
                            $('#hu-inquiry-response').html('<p class="error">' + response.data.message + '</p>');
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
        add_menu_page(
            'Property Inquiries',
            'Inquiries',
            'manage_options',
            'hu-inquiries',
            [__CLASS__, 'admin_page'],
            'dashicons-email',
            30
        );
    }

    /**
     * Admin page
     */
    public static function admin_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';

        // Handle status updates
        if (isset($_GET['action']) && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $action = sanitize_text_field($_GET['action']);

            if ($action === 'mark_read') {
                $wpdb->update($table, ['status' => 'read'], ['id' => $id]);
            } elseif ($action === 'mark_pending') {
                $wpdb->update($table, ['status' => 'pending'], ['id' => $id]);
            }
        }

        // Get inquiries
        $inquiries = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC");

        ?>
        <div class="wrap">
            <h1>Property Inquiries</h1>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($inquiries as $inquiry) : ?>
                        <tr>
                            <td>
                                <a href="<?php echo get_permalink($inquiry->property_id); ?>" target="_blank">
                                    <?php echo get_the_title($inquiry->property_id); ?>
                                </a>
                            </td>
                            <td><?php echo esc_html($inquiry->name); ?></td>
                            <td><a href="mailto:<?php echo esc_attr($inquiry->email); ?>"><?php echo esc_html($inquiry->email); ?></a></td>
                            <td><?php echo esc_html($inquiry->inquiry_type); ?></td>
                            <td>
                                <span class="status-<?php echo esc_attr($inquiry->status); ?>">
                                    <?php echo esc_html(ucfirst($inquiry->status)); ?>
                                </span>
                            </td>
                            <td><?php echo esc_html($inquiry->created_at); ?></td>
                            <td>
                                <a href="?page=hu-inquiries&action=mark_read&id=<?php echo $inquiry->id; ?>">Mark Read</a> |
                                <a href="?page=hu-inquiries&action=mark_pending&id=<?php echo $inquiry->id; ?>">Mark Pending</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}