<?php
/**
 * House Unlimited Admin Dashboard Enhancements
 *
 * Enhanced admin features for real estate management
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}

class HU_Admin_Enhancements {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
        add_action('wp_dashboard_setup', [$this, 'add_dashboard_widgets']);

        // Property columns
        add_filter('manage_property_posts_columns', [$this, 'add_property_columns']);
        add_action('manage_property_posts_custom_column', [$this, 'populate_property_columns'], 10, 2);

        // Agent columns
        add_filter('manage_agent_posts_columns', [$this, 'add_agent_columns']);
        add_action('manage_agent_posts_custom_column', [$this, 'populate_agent_columns'], 10, 2);

        // Bulk actions
        add_filter('bulk_actions-edit-property', [$this, 'add_property_bulk_actions']);
        add_filter('handle_bulk_actions-edit-property', [$this, 'handle_property_bulk_actions'], 10, 3);

        // Quick edit
        add_action('quick_edit_custom_box', [$this, 'quick_edit_property_fields'], 10, 2);
        add_action('save_post', [$this, 'save_quick_edit_data']);

        // Admin notices
        add_action('admin_notices', [$this, 'admin_notices']);
    }

    /**
     * Add admin menu items
     */
    public function add_admin_menu() {
        add_menu_page(
            'House Unlimited',
            'House Unlimited',
            'manage_options',
            'hu-dashboard',
            [$this, 'main_dashboard_page'],
            'dashicons-building',
            30
        );

        add_submenu_page(
            'hu-dashboard',
            'Dashboard Overview',
            'Dashboard',
            'manage_options',
            'hu-dashboard',
            [$this, 'main_dashboard_page']
        );

        add_submenu_page(
            'hu-dashboard',
            'Property Management',
            'Properties',
            'manage_options',
            'edit.php?post_type=property'
        );

        add_submenu_page(
            'hu-dashboard',
            'Agent Management',
            'Agents',
            'manage_options',
            'edit.php?post_type=agent'
        );

        add_submenu_page(
            'hu-dashboard',
            'Inquiries',
            'Inquiries',
            'manage_options',
            'hu-inquiries',
            [$this, 'inquiries_page']
        );

        add_submenu_page(
            'hu-dashboard',
            'Reviews',
            'Reviews',
            'manage_options',
            'hu-reviews',
            [$this, 'reviews_page']
        );

        add_submenu_page(
            'hu-dashboard',
            'Analytics',
            'Analytics',
            'manage_options',
            'hu-analytics',
            [$this, 'analytics_page']
        );

        add_submenu_page(
            'hu-dashboard',
            'Migration Status',
            'Migration',
            'manage_options',
            'hu-migration',
            [$this, 'migration_page']
        );
    }

    /**
     * Main dashboard page
     */
    public function main_dashboard_page() {
        ?>
        <div class="wrap">
            <h1>House Unlimited Dashboard</h1>

            <div class="hu-dashboard-grid">
                <!-- Stats Cards -->
                <div class="hu-stat-card">
                    <h3>Properties</h3>
                    <div class="hu-stat-number"><?php echo $this->get_property_count(); ?></div>
                    <p>Total active listings</p>
                </div>

                <div class="hu-stat-card">
                    <h3>Agents</h3>
                    <div class="hu-stat-number"><?php echo $this->get_agent_count(); ?></div>
                    <p>Registered agents</p>
                </div>

                <div class="hu-stat-card">
                    <h3>Inquiries</h3>
                    <div class="hu-stat-number"><?php echo $this->get_inquiry_count(); ?></div>
                    <p>This month</p>
                </div>

                <div class="hu-stat-card">
                    <h3>Reviews</h3>
                    <div class="hu-stat-number"><?php echo $this->get_review_count(); ?></div>
                    <p>Average rating: <?php echo $this->get_average_rating(); ?>/5</p>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="hu-dashboard-section">
                <h2>Recent Activity</h2>
                <?php $this->display_recent_activity(); ?>
            </div>

            <!-- Quick Actions -->
            <div class="hu-dashboard-section">
                <h2>Quick Actions</h2>
                <div class="hu-quick-actions">
                    <a href="<?php echo admin_url('post-new.php?post_type=property'); ?>" class="button button-primary">Add New Property</a>
                    <a href="<?php echo admin_url('post-new.php?post_type=agent'); ?>" class="button">Add New Agent</a>
                    <a href="<?php echo admin_url('admin.php?page=hu-inquiries'); ?>" class="button">View Inquiries</a>
                    <a href="<?php echo admin_url('admin.php?page=hu-analytics'); ?>" class="button">View Analytics</a>
                </div>
            </div>
        </div>

        <style>
        .hu-dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .hu-stat-card {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .hu-stat-card h3 {
            margin: 0 0 10px 0;
            color: #23282d;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .hu-stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #007cba;
            margin: 10px 0;
        }

        .hu-dashboard-section {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            margin: 20px 0;
            padding: 20px;
        }

        .hu-quick-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .hu-quick-actions .button {
            padding: 8px 16px;
        }
        </style>
        <?php
    }

    /**
     * Inquiries management page
     */
    public function inquiries_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';

        // Handle bulk actions
        if (isset($_POST['action']) && isset($_POST['inquiry_ids'])) {
            $this->handle_inquiry_bulk_actions($_POST['action'], $_POST['inquiry_ids']);
        }

        // Get inquiries with pagination
        $per_page = 20;
        $current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($current_page - 1) * $per_page;

        $status_filter = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        $where_clause = $status_filter ? $wpdb->prepare("WHERE status = %s", $status_filter) : '';

        $total_inquiries = $wpdb->get_var("SELECT COUNT(*) FROM $table $where_clause");
        $inquiries = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table $where_clause ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $per_page, $offset
        ));

        $total_pages = ceil($total_inquiries / $per_page);

        ?>
        <div class="wrap">
            <h1>Inquiry Management</h1>

            <!-- Filters -->
            <div class="tablenav top">
                <div class="alignleft actions">
                    <form method="get">
                        <input type="hidden" name="page" value="hu-inquiries">
                        <select name="status">
                            <option value="">All Statuses</option>
                            <option value="pending" <?php selected($status_filter, 'pending'); ?>>Pending</option>
                            <option value="responded" <?php selected($status_filter, 'responded'); ?>>Responded</option>
                            <option value="closed" <?php selected($status_filter, 'closed'); ?>>Closed</option>
                        </select>
                        <input type="submit" class="button" value="Filter">
                    </form>
                </div>
            </div>

            <!-- Bulk Actions Form -->
            <form method="post">
                <div class="tablenav top">
                    <div class="alignleft actions">
                        <select name="action">
                            <option value="">Bulk Actions</option>
                            <option value="mark_responded">Mark as Responded</option>
                            <option value="mark_closed">Mark as Closed</option>
                            <option value="delete">Delete</option>
                        </select>
                        <input type="submit" class="button action" value="Apply">
                    </div>
                </div>

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th class="check-column"><input type="checkbox" id="cb-select-all"></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($inquiries as $inquiry): ?>
                        <tr>
                            <th class="check-column">
                                <input type="checkbox" name="inquiry_ids[]" value="<?php echo $inquiry->id; ?>">
                            </th>
                            <td><?php echo esc_html($inquiry->name); ?></td>
                            <td><a href="mailto:<?php echo esc_attr($inquiry->email); ?>"><?php echo esc_html($inquiry->email); ?></a></td>
                            <td><?php echo esc_html($inquiry->phone); ?></td>
                            <td><?php echo $this->get_property_title($inquiry->property_id); ?></td>
                            <td><?php echo esc_html($inquiry->inquiry_type); ?></td>
                            <td>
                                <span class="status-<?php echo esc_attr($inquiry->status); ?>">
                                    <?php echo ucfirst($inquiry->status); ?>
                                </span>
                            </td>
                            <td><?php echo date('M j, Y', strtotime($inquiry->created_at)); ?></td>
                            <td>
                                <a href="#" class="view-inquiry" data-id="<?php echo $inquiry->id; ?>">View</a> |
                                <a href="#" class="respond-inquiry" data-id="<?php echo $inquiry->id; ?>">Respond</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </form>

            <!-- Pagination -->
            <?php if ($total_pages > 1): ?>
            <div class="tablenav bottom">
                <div class="tablenav-pages">
                    <?php
                    echo paginate_links([
                        'base' => add_query_arg('paged', '%#%'),
                        'format' => '',
                        'prev_text' => __('&laquo;'),
                        'next_text' => __('&raquo;'),
                        'total' => $total_pages,
                        'current' => $current_page
                    ]);
                    ?>
                </div>
            </div>
            <?php endif; ?>
        </div>

        <style>
        .status-pending { color: #ff6b35; font-weight: bold; }
        .status-responded { color: #4CAF50; }
        .status-closed { color: #666; }
        </style>
        <?php
    }

    /**
     * Reviews management page
     */
    public function reviews_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';

        // Handle bulk actions
        if (isset($_POST['action']) && isset($_POST['review_ids'])) {
            $this->handle_review_bulk_actions($_POST['action'], $_POST['review_ids']);
        }

        // Get reviews
        $per_page = 20;
        $current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($current_page - 1) * $per_page;

        $status_filter = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        $where_clause = $status_filter ? $wpdb->prepare("WHERE status = %s", $status_filter) : '';

        $total_reviews = $wpdb->get_var("SELECT COUNT(*) FROM $table $where_clause");
        $reviews = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table $where_clause ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $per_page, $offset
        ));

        $total_pages = ceil($total_reviews / $per_page);

        ?>
        <div class="wrap">
            <h1>Review Management</h1>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($reviews as $review): ?>
                    <tr>
                        <td><?php echo $this->get_property_title($review->property_id); ?></td>
                        <td><?php echo $this->get_user_name($review->user_id); ?></td>
                        <td>
                            <div class="star-rating">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <span class="star <?php echo $i <= $review->rating ? 'filled' : ''; ?>">&#9733;</span>
                                <?php endfor; ?>
                            </div>
                        </td>
                        <td><?php echo wp_trim_words($review->review, 10); ?></td>
                        <td><?php echo ucfirst($review->status); ?></td>
                        <td><?php echo date('M j, Y', strtotime($review->created_at)); ?></td>
                        <td>
                            <a href="#" class="view-review" data-id="<?php echo $review->id; ?>">View</a> |
                            <a href="#" class="approve-review" data-id="<?php echo $review->id; ?>">Approve</a> |
                            <a href="#" class="reject-review" data-id="<?php echo $review->id; ?>">Reject</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <style>
        .star-rating .star {
            color: #ddd;
            font-size: 16px;
        }
        .star-rating .star.filled {
            color: #ffb400;
        }
        </style>
        <?php
    }

    /**
     * Analytics page
     */
    public function analytics_page() {
        ?>
        <div class="wrap">
            <h1>Analytics Dashboard</h1>

            <div class="hu-analytics-grid">
                <div class="hu-chart-container">
                    <h3>Property Views (Last 30 Days)</h3>
                    <canvas id="property-views-chart"></canvas>
                </div>

                <div class="hu-chart-container">
                    <h3>Inquiry Trends</h3>
                    <canvas id="inquiry-trends-chart"></canvas>
                </div>

                <div class="hu-chart-container">
                    <h3>Top Performing Properties</h3>
                    <div id="top-properties-list">
                        <?php $this->display_top_properties(); ?>
                    </div>
                </div>

                <div class="hu-chart-container">
                    <h3>Agent Performance</h3>
                    <div id="agent-performance-list">
                        <?php $this->display_agent_performance(); ?>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
        // Property views chart
        const ctx1 = document.getElementById('property-views-chart').getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: <?php echo json_encode($this->get_chart_labels(30)); ?>,
                datasets: [{
                    label: 'Property Views',
                    data: <?php echo json_encode($this->get_property_views_data(30)); ?>,
                    borderColor: '#007cba',
                    backgroundColor: 'rgba(0, 124, 186, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Inquiry trends chart
        const ctx2 = document.getElementById('inquiry-trends-chart').getContext('2d');
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: <?php echo json_encode($this->get_chart_labels(30)); ?>,
                datasets: [{
                    label: 'Inquiries',
                    data: <?php echo json_encode($this->get_inquiry_trends_data(30)); ?>,
                    backgroundColor: '#4CAF50'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        </script>

        <style>
        .hu-analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .hu-chart-container {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
        }

        .hu-chart-container h3 {
            margin-top: 0;
            color: #23282d;
        }
        </style>
        <?php
    }

    /**
     * Migration status page
     */
    public function migration_page() {
        if (isset($_POST['run_incremental_migration'])) {
            $this->run_incremental_migration_from_admin();
        }

        $progress = hu_get_migration_progress();

        ?>
        <div class="wrap">
            <h1>Migration Status</h1>

            <div class="hu-migration-status">
                <h2>Current Progress</h2>
                <div class="hu-progress-bars">
                    <?php foreach ($progress as $type => $completed): ?>
                    <div class="hu-progress-item">
                        <label><?php echo ucfirst(str_replace('_', ' ', $type)); ?></label>
                        <div class="hu-progress-bar">
                            <div class="hu-progress-fill <?php echo $completed ? 'completed' : 'pending'; ?>"
                                 style="width: <?php echo $completed ? '100%' : '0%'; ?>"></div>
                        </div>
                        <span class="hu-progress-text"><?php echo $completed ? 'Completed' : 'Pending'; ?></span>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="hu-migration-actions">
                <h2>Incremental Migration</h2>
                <form method="post">
                    <select name="migration_type">
                        <option value="users">Users</option>
                        <option value="properties">Properties</option>
                        <option value="agents">Agents</option>
                        <option value="blog_posts">Blog Posts</option>
                        <option value="inquiries">Inquiries</option>
                        <option value="reviews">Reviews</option>
                        <option value="subscribers">Subscribers</option>
                    </select>
                    <input type="number" name="batch_size" value="10" min="1" max="100">
                    <input type="submit" name="run_incremental_migration" class="button button-primary" value="Run Migration">
                </form>
            </div>

            <div class="hu-migration-logs">
                <h2>Recent Logs</h2>
                <div class="hu-log-viewer">
                    <?php $this->display_recent_logs(); ?>
                </div>
            </div>
        </div>

        <style>
        .hu-progress-item {
            margin: 10px 0;
        }

        .hu-progress-bar {
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 5px 0;
        }

        .hu-progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }

        .hu-progress-fill.completed {
            background: #4CAF50;
        }

        .hu-progress-fill.pending {
            background: #ff9800;
        }

        .hu-log-viewer {
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        }
        </style>
        <?php
    }

    /**
     * Add property columns to admin list
     */
    public function add_property_columns($columns) {
        $new_columns = [];
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'title') {
                $new_columns['price'] = 'Price';
                $new_columns['beds'] = 'Beds';
                $new_columns['baths'] = 'Baths';
                $new_columns['status'] = 'Status';
            }
        }
        return $new_columns;
    }

    /**
     * Populate property columns
     */
    public function populate_property_columns($column, $post_id) {
        switch ($column) {
            case 'price':
                $price = get_post_meta($post_id, 'price', true);
                echo $price ? '$' . number_format($price) : '-';
                break;
            case 'beds':
                $beds = get_post_meta($post_id, 'beds', true);
                echo $beds ?: '-';
                break;
            case 'baths':
                $baths = get_post_meta($post_id, 'baths', true);
                echo $baths ?: '-';
                break;
            case 'status':
                $terms = wp_get_post_terms($post_id, 'property_status');
                if (!empty($terms)) {
                    echo esc_html($terms[0]->name);
                } else {
                    echo '-';
                }
                break;
        }
    }

    /**
     * Add agent columns
     */
    public function add_agent_columns($columns) {
        $columns['phone'] = 'Phone';
        $columns['email'] = 'Email';
        $columns['properties'] = 'Properties';
        return $columns;
    }

    /**
     * Populate agent columns
     */
    public function populate_agent_columns($column, $post_id) {
        switch ($column) {
            case 'phone':
                $phone = get_post_meta($post_id, 'phone', true);
                echo $phone ? '<a href="tel:' . esc_attr($phone) . '">' . esc_html($phone) . '</a>' : '-';
                break;
            case 'email':
                $email = get_post_meta($post_id, 'email', true);
                echo $email ? '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>' : '-';
                break;
            case 'properties':
                $properties_count = $this->get_agent_properties_count($post_id);
                echo $properties_count;
                break;
        }
    }

    /**
     * Add dashboard widgets
     */
    public function add_dashboard_widgets() {
        wp_add_dashboard_widget(
            'hu_recent_inquiries',
            'Recent Property Inquiries',
            [$this, 'dashboard_recent_inquiries_widget']
        );

        wp_add_dashboard_widget(
            'hu_property_stats',
            'Property Statistics',
            [$this, 'dashboard_property_stats_widget']
        );
    }

    /**
     * Recent inquiries dashboard widget
     */
    public function dashboard_recent_inquiries_widget() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';

        $inquiries = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC LIMIT 5");

        if (empty($inquiries)) {
            echo '<p>No recent inquiries.</p>';
            return;
        }

        echo '<ul>';
        foreach ($inquiries as $inquiry) {
            $property_title = $this->get_property_title($inquiry->property_id);
            echo '<li>';
            echo '<strong>' . esc_html($inquiry->name) . '</strong> inquired about ';
            echo '<em>' . esc_html($property_title) . '</em>';
            echo '<br><small>' . date('M j, Y H:i', strtotime($inquiry->created_at)) . '</small>';
            echo '</li>';
        }
        echo '</ul>';
    }

    /**
     * Property stats dashboard widget
     */
    public function dashboard_property_stats_widget() {
        $total_properties = $this->get_property_count();
        $featured_properties = $this->get_featured_property_count();
        $total_views = $this->get_total_property_views();

        echo '<ul>';
        echo '<li><strong>Total Properties:</strong> ' . $total_properties . '</li>';
        echo '<li><strong>Featured Properties:</strong> ' . $featured_properties . '</li>';
        echo '<li><strong>Total Views:</strong> ' . $total_views . '</li>';
        echo '</ul>';
    }

    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'hu-') !== false || $hook === 'toplevel_page_hu-dashboard') {
            wp_enqueue_script('hu-admin-js', plugin_dir_url(__FILE__) . 'js/admin.js', ['jquery'], '1.0.0', true);
            wp_enqueue_style('hu-admin-css', plugin_dir_url(__FILE__) . 'css/admin.css', [], '1.0.0');
        }
    }

    // Helper methods would go here...
    // (get_property_count, get_agent_count, etc.)

    private function get_property_count() {
        return wp_count_posts('property')->publish;
    }

    private function get_agent_count() {
        return wp_count_posts('agent')->publish;
    }

    private function get_inquiry_count() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_inquiries';
        return $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE MONTH(created_at) = MONTH(CURRENT_DATE())");
    }

    private function get_review_count() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';
        return $wpdb->get_var("SELECT COUNT(*) FROM $table");
    }

    private function get_average_rating() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_reviews';
        $avg = $wpdb->get_var("SELECT AVG(rating) FROM $table WHERE status = 'approved'");
        return $avg ? round($avg, 1) : '0.0';
    }

    private function display_recent_activity() {
        // Implementation for recent activity display
        echo '<p>Recent activity will be displayed here...</p>';
    }

    private function get_property_title($property_id) {
        if (!$property_id) return 'N/A';
        $property = get_post($property_id);
        return $property ? $property->post_title : 'Unknown Property';
    }

    private function get_user_name($user_id) {
        if (!$user_id) return 'Anonymous';
        $user = get_userdata($user_id);
        return $user ? $user->display_name : 'Unknown User';
    }

    private function get_agent_properties_count($agent_id) {
        $args = [
            'post_type' => 'property',
            'meta_query' => [
                [
                    'key' => 'agent_id',
                    'value' => $agent_id,
                    'compare' => '='
                ]
            ],
            'posts_per_page' => -1
        ];
        $query = new WP_Query($args);
        return $query->found_posts;
    }

    private function get_featured_property_count() {
        $args = [
            'post_type' => 'property',
            'meta_query' => [
                [
                    'key' => 'featured',
                    'value' => '1',
                    'compare' => '='
                ]
            ],
            'posts_per_page' => -1
        ];
        $query = new WP_Query($args);
        return $query->found_posts;
    }

    private function get_total_property_views() {
        global $wpdb;
        $table = $wpdb->prefix . 'hu_property_views';
        return $wpdb->get_var("SELECT COUNT(*) FROM $table");
    }

    private function display_top_properties() {
        // Implementation for top properties
        echo '<p>Top properties will be listed here...</p>';
    }

    private function display_agent_performance() {
        // Implementation for agent performance
        echo '<p>Agent performance metrics will be shown here...</p>';
    }

    private function get_chart_labels($days) {
        $labels = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $labels[] = date('M j', strtotime("-{$i} days"));
        }
        return $labels;
    }

    private function get_property_views_data($days) {
        // Implementation for property views data
        return array_fill(0, $days, rand(10, 50));
    }

    private function get_inquiry_trends_data($days) {
        // Implementation for inquiry trends data
        return array_fill(0, $days, rand(1, 10));
    }

    private function display_recent_logs() {
        $log_file = HU_MIGRATION_LOG_FILE;
        if (file_exists($log_file)) {
            $logs = array_slice(file($log_file), -20); // Last 20 lines
            echo '<pre>' . implode('', array_map('esc_html', $logs)) . '</pre>';
        } else {
            echo '<p>No migration logs found.</p>';
        }
    }

    private function run_incremental_migration_from_admin() {
        // Implementation for running incremental migration from admin
        echo '<div class="notice notice-info"><p>Migration functionality would be implemented here.</p></div>';
    }

    private function handle_inquiry_bulk_actions($action, $inquiry_ids) {
        // Implementation for bulk actions on inquiries
    }

    private function handle_review_bulk_actions($action, $review_ids) {
        // Implementation for bulk actions on reviews
    }

    private function add_property_bulk_actions($actions) {
        $actions['feature'] = 'Mark as Featured';
        $actions['unfeature'] = 'Remove Featured';
        return $actions;
    }

    private function handle_property_bulk_actions($redirect_to, $doaction, $post_ids) {
        // Implementation for property bulk actions
        return $redirect_to;
    }

    private function quick_edit_property_fields($column_name, $post_type) {
        // Implementation for quick edit fields
    }

    private function save_quick_edit_data($post_id) {
        // Implementation for saving quick edit data
    }

    private function admin_notices() {
        // Implementation for admin notices
    }
}

// Initialize the admin enhancements
new HU_Admin_Enhancements();