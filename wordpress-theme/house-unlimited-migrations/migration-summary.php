<?php
/**
 * House Unlimited Migration Summary & Next Steps
 *
 * This script provides a comprehensive overview of the migration process
 * and guides you through the next steps after migration completion.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}

class HU_Migration_Summary {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_summary_menu']);
    }

    /**
     * Add summary menu
     */
    public function add_summary_menu() {
        add_submenu_page(
            'hu-dashboard',
            'Migration Summary',
            'Migration Summary',
            'manage_options',
            'hu-migration-summary',
            [$this, 'summary_page']
        );
    }

    /**
     * Summary page
     */
    public function summary_page() {
        $progress = hu_get_migration_progress();
        $all_completed = !in_array(false, $progress);

        ?>
        <div class="wrap">
            <h1>Migration Summary & Next Steps</h1>

            <?php if ($all_completed): ?>
                <div class="notice notice-success">
                    <h2>🎉 Migration Completed Successfully!</h2>
                    <p>All data has been migrated from MongoDB to WordPress. Your House Unlimited platform is now running on WordPress!</p>
                </div>
            <?php else: ?>
                <div class="notice notice-warning">
                    <h2>⚠️ Migration In Progress</h2>
                    <p>Some data types are still pending migration. Please complete all migration steps before proceeding.</p>
                </div>
            <?php endif; ?>

            <!-- Migration Status Overview -->
            <div class="hu-summary-section">
                <h2>Migration Status Overview</h2>
                <div class="hu-status-grid">
                    <?php foreach ($progress as $type => $completed): ?>
                    <div class="hu-status-item <?php echo $completed ? 'completed' : 'pending'; ?>">
                        <div class="hu-status-icon">
                            <?php echo $completed ? '✅' : '⏳'; ?>
                        </div>
                        <div class="hu-status-content">
                            <h3><?php echo ucfirst(str_replace('_', ' ', $type)); ?></h3>
                            <p><?php echo $completed ? 'Migration completed' : 'Pending migration'; ?></p>
                            <?php if (!$completed): ?>
                            <button class="button button-small run-migration" data-type="<?php echo $type; ?>">
                                Run Migration
                            </button>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Data Verification -->
            <div class="hu-summary-section">
                <h2>Data Verification</h2>
                <div class="hu-verification-grid">
                    <div class="hu-verification-item">
                        <h3>Properties</h3>
                        <div class="hu-count"><?php echo $this->get_migrated_count('properties'); ?></div>
                        <p>Migrated properties</p>
                    </div>
                    <div class="hu-verification-item">
                        <h3>Agents</h3>
                        <div class="hu-count"><?php echo $this->get_migrated_count('agents'); ?></div>
                        <p>Migrated agents</p>
                    </div>
                    <div class="hu-verification-item">
                        <h3>Users</h3>
                        <div class="hu-count"><?php echo $this->get_migrated_count('users'); ?></div>
                        <p>Migrated users</p>
                    </div>
                    <div class="hu-verification-item">
                        <h3>Inquiries</h3>
                        <div class="hu-count"><?php echo $this->get_migrated_count('inquiries'); ?></div>
                        <p>Migrated inquiries</p>
                    </div>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="hu-summary-section">
                <h2>Next Steps</h2>
                <div class="hu-steps-list">
                    <div class="hu-step <?php echo $all_completed ? 'completed' : 'pending'; ?>">
                        <div class="hu-step-number">1</div>
                        <div class="hu-step-content">
                            <h3>Complete Data Migration</h3>
                            <p>Ensure all data types have been successfully migrated from MongoDB to WordPress.</p>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">2</div>
                        <div class="hu-step-content">
                            <h3>Update Permalinks</h3>
                            <p>Go to <a href="<?php echo admin_url('options-permalink.php'); ?>">Settings > Permalinks</a> and click "Save Changes" to refresh your URL structure.</p>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">3</div>
                        <div class="hu-step-content">
                            <h3>Regenerate Thumbnails</h3>
                            <p>Install and run the "Regenerate Thumbnails" plugin to ensure all property and agent images display correctly.</p>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">4</div>
                        <div class="hu-step-content">
                            <h3>Test Core Functionality</h3>
                            <ul>
                                <li>Property search and filtering</li>
                                <li>Agent profiles and listings</li>
                                <li>User registration and login</li>
                                <li>Inquiry form submissions</li>
                                <li>Review system</li>
                            </ul>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">5</div>
                        <div class="hu-step-content">
                            <h3>Configure SEO Settings</h3>
                            <p>Install Yoast SEO or similar plugin and configure property and agent page SEO settings.</p>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">6</div>
                        <div class="hu-step-content">
                            <h3>Setup Email Notifications</h3>
                            <p>Configure email settings for inquiry notifications, user registrations, and other automated emails.</p>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">7</div>
                        <div class="hu-step-content">
                            <h3>Performance Optimization</h3>
                            <ul>
                                <li>Enable caching (WP Rocket, W3 Total Cache)</li>
                                <li>Optimize images</li>
                                <li>Setup CDN for media files</li>
                                <li>Database optimization</li>
                            </ul>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">8</div>
                        <div class="hu-step-content">
                            <h3>Security Hardening</h3>
                            <ul>
                                <li>Install security plugins (Wordfence, Sucuri)</li>
                                <li>Setup regular backups</li>
                                <li>Update all plugins and themes</li>
                                <li>Configure firewall rules</li>
                            </ul>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">9</div>
                        <div class="hu-step-content">
                            <h3>Launch Preparation</h3>
                            <ul>
                                <li>Setup Google Analytics</li>
                                <li>Configure Google Search Console</li>
                                <li>Test contact forms</li>
                                <li>Verify mobile responsiveness</li>
                                <li>Cross-browser testing</li>
                            </ul>
                        </div>
                    </div>

                    <div class="hu-step">
                        <div class="hu-step-number">10</div>
                        <div class="hu-step-content">
                            <h3>Go Live!</h3>
                            <p>Update DNS settings, monitor site performance, and announce the new WordPress-powered platform to your users.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Migration Logs -->
            <div class="hu-summary-section">
                <h2>Migration Logs</h2>
                <div class="hu-logs-container">
                    <div class="hu-log-tabs">
                        <button class="hu-log-tab active" data-log="general">General</button>
                        <button class="hu-log-tab" data-log="errors">Errors</button>
                    </div>
                    <div class="hu-log-content" id="general-logs">
                        <?php $this->display_log_content(HU_MIGRATION_LOG_FILE); ?>
                    </div>
                    <div class="hu-log-content" id="error-logs" style="display: none;">
                        <?php $this->display_log_content(HU_MIGRATION_ERROR_LOG); ?>
                    </div>
                </div>
            </div>

            <!-- Support Resources -->
            <div class="hu-summary-section">
                <h2>Support Resources</h2>
                <div class="hu-resources-grid">
                    <div class="hu-resource-item">
                        <h3>Documentation</h3>
                        <p>Complete migration guide and WordPress theme documentation.</p>
                        <a href="#" class="button">View Docs</a>
                    </div>
                    <div class="hu-resource-item">
                        <h3>Support Forum</h3>
                        <p>Get help from the community and WordPress experts.</p>
                        <a href="#" class="button">Get Support</a>
                    </div>
                    <div class="hu-resource-item">
                        <h3>Video Tutorials</h3>
                        <p>Step-by-step video guides for common tasks and configurations.</p>
                        <a href="#" class="button">Watch Videos</a>
                    </div>
                </div>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            // Log tabs
            $('.hu-log-tab').on('click', function() {
                $('.hu-log-tab').removeClass('active');
                $(this).addClass('active');

                $('.hu-log-content').hide();
                $('#' + $(this).data('log') + '-logs').show();
            });

            // Run migration buttons
            $('.run-migration').on('click', function() {
                var type = $(this).data('type');
                if (confirm('Are you sure you want to run migration for ' + type + '?')) {
                    // AJAX call to run migration
                    $(this).prop('disabled', true).text('Running...');
                    // Implementation would go here
                }
            });
        });
        </script>

        <style>
        .hu-summary-section {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            margin: 20px 0;
            padding: 20px;
        }

        .hu-summary-section h2 {
            margin-top: 0;
            color: #23282d;
            border-bottom: 2px solid #007cba;
            padding-bottom: 10px;
        }

        .hu-status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .hu-status-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            background: #f9f9f9;
        }

        .hu-status-item.completed {
            background: #f0f9f0;
            border-color: #4CAF50;
        }

        .hu-status-item.pending {
            background: #fff9e6;
            border-color: #ff9800;
        }

        .hu-status-icon {
            font-size: 24px;
            margin-right: 15px;
        }

        .hu-status-content h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
        }

        .hu-status-content p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }

        .hu-verification-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .hu-verification-item {
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 6px;
        }

        .hu-verification-item h3 {
            margin: 0 0 10px 0;
            color: #23282d;
        }

        .hu-count {
            font-size: 36px;
            font-weight: bold;
            color: #007cba;
            margin: 10px 0;
        }

        .hu-steps-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .hu-step {
            display: flex;
            align-items: flex-start;
            padding: 15px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            background: #f9f9f9;
        }

        .hu-step.completed {
            background: #f0f9f0;
            border-color: #4CAF50;
        }

        .hu-step-number {
            width: 30px;
            height: 30px;
            background: #007cba;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .hu-step.completed .hu-step-number {
            background: #4CAF50;
        }

        .hu-step-content h3 {
            margin: 0 0 5px 0;
            color: #23282d;
        }

        .hu-step-content ul {
            margin: 10px 0 0 0;
            padding-left: 20px;
        }

        .hu-logs-container {
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .hu-log-tabs {
            display: flex;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }

        .hu-log-tab {
            padding: 10px 20px;
            border: none;
            background: none;
            cursor: pointer;
            border-bottom: 2px solid transparent;
        }

        .hu-log-tab.active {
            background: #fff;
            border-bottom-color: #007cba;
        }

        .hu-log-content {
            padding: 15px;
            background: #fff;
            max-height: 300px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.4;
        }

        .hu-resources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .hu-resource-item {
            padding: 20px;
            background: #f9f9f9;
            border-radius: 6px;
            text-align: center;
        }

        .hu-resource-item h3 {
            margin: 0 0 10px 0;
            color: #23282d;
        }

        .hu-resource-item p {
            margin: 0 0 15px 0;
            color: #666;
        }
        </style>
        <?php
    }

    /**
     * Get migrated count for a data type
     */
    private function get_migrated_count($type) {
        switch ($type) {
            case 'properties':
                return wp_count_posts('property')->publish;
            case 'agents':
                return wp_count_posts('agent')->publish;
            case 'users':
                return count_users()['total_users'];
            case 'inquiries':
                global $wpdb;
                $table = $wpdb->prefix . 'hu_inquiries';
                return $wpdb->get_var("SELECT COUNT(*) FROM $table");
            default:
                return 0;
        }
    }

    /**
     * Display log content
     */
    private function display_log_content($log_file) {
        if (file_exists($log_file)) {
            $logs = file($log_file);
            $recent_logs = array_slice($logs, -50); // Last 50 lines

            echo '<pre>';
            foreach ($recent_logs as $log) {
                echo esc_html($log);
            }
            echo '</pre>';
        } else {
            echo '<p>No logs available.</p>';
        }
    }
}

// Initialize the migration summary
new HU_Migration_Summary();