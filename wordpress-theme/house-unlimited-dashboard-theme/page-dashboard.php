<?php
/**
 * Template Name: Dashboard
 *
 * @package HouseUnlimitedDashboard
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$current_user = wp_get_current_user();
$role = hud_get_user_role_key($current_user);
$display_name = hud_get_user_display_name($current_user);
$hour = (int) current_time('H');
$greeting = $hour < 12 ? 'Good morning' : ($hour < 17 ? 'Good afternoon' : 'Good evening');
?>

<div class="layout">
    <?php get_template_part('template-parts/dashboard', 'sidebar'); ?>
    <?php get_template_part('template-parts/dashboard', 'header'); ?>

    <main class="main-content">
        <?php if ($role === 'admin') : ?>
            <div class="page-header top-left">
                <div>
                    <h1>Hello, <?php echo esc_html($display_name ?: 'Admin'); ?>!</h1>
                    <p><?php echo esc_html($greeting); ?>, welcome back to your <?php echo esc_html(ucfirst($role)); ?> dashboard.</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card main-stat-card" data-href="<?php echo esc_url(home_url('/dashboard/users')); ?>">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-value" id="totalUsers">0</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/properties')); ?>">
                    <div class="stat-icon"><i class="fas fa-building"></i></div>
                    <div class="stat-value" id="totalProperties">0</div>
                    <div class="stat-label">Active Listings</div>
                </div>
                <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/payments')); ?>">
                    <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
                    <div class="stat-value" id="totalRevenue">₦0</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/appointments')); ?>">
                    <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                    <div class="stat-value" id="todayAppointments">0</div>
                    <div class="stat-label">Inspections Today</div>
                </div>
            </div>

            <div class="quick-actions">
                <a href="<?php echo esc_url(home_url('/dashboard/users')); ?>" class="quick-btn">
                    <i class="fas fa-user-cog"></i>
                    <p>Manage Users</p>
                </a>
                <a href="<?php echo esc_url(home_url('/dashboard/properties')); ?>" class="quick-btn">
                    <i class="fas fa-building"></i>
                    <p>All Properties</p>
                </a>
                <a href="<?php echo esc_url(home_url('/dashboard/payments')); ?>" class="quick-btn">
                    <i class="fas fa-credit-card"></i>
                    <p>View All Transactions</p>
                </a>
                <a href="<?php echo esc_url(home_url('/dashboard/documents')); ?>" class="quick-btn">
                    <i class="fas fa-file-alt"></i>
                    <p>System Documents</p>
                </a>
            </div>

            <div class="dashboard-grid">
                <div class="activity-card">
                    <h2><i class="fas fa-history"></i> Recent Activity</h2>
                    <ul class="activity-list" id="activityLog">
                        <li class="activity-item">
                            <div class="activity-text">Loading admin activity...</div>
                        </li>
                    </ul>
                </div>
                <div class="tasks-card">
                    <h2><i class="fas fa-list-check"></i> Pending Tasks <span id="tasksCountBadge" class="badge">0</span></h2>
                    <ul class="activity-list" id="tasksList">
                        <li class="activity-item">
                            <div class="activity-text">Loading pending tasks...</div>
                        </li>
                    </ul>
                </div>
            </div>
        <?php else : ?>
            <div class="page-header top-left" style="display:flex; flex-direction:column; gap:0.5rem;">
                <div>
                    <h1>Hello, <?php echo esc_html($display_name ?: 'User'); ?>!</h1>
                    <p><?php echo esc_html($greeting); ?>, welcome back to your Investment dashboard.</p>
                </div>
            </div>

            <div class="stats-grid">
                <?php if ($role === 'client') : ?>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/investor-deals')); ?>">
                        <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-value" id="availableInvestorDeals">0</div>
                        <div class="stat-label">Available Investors Deals</div>
                    </div>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/my-properties')); ?>">
                        <div class="stat-icon"><i class="fas fa-home"></i></div>
                        <div class="stat-value" id="clientProperties">0</div>
                        <div class="stat-label">Owned Properties</div>
                    </div>
                <?php else : ?>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/properties')); ?>">
                        <div class="stat-icon"><i class="fas fa-building"></i></div>
                        <div class="stat-value" id="agentListings">0</div>
                        <div class="stat-label">My Listings</div>
                    </div>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/appointments')); ?>">
                        <div class="stat-icon"><i class="fas fa-eye"></i></div>
                        <div class="stat-value" id="agentAppointments">0</div>
                        <div class="stat-label">Pending Viewings</div>
                    </div>
                <?php endif; ?>

                <?php if ($role === 'client') : ?>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/payments')); ?>">
                        <div class="stat-icon"><i class="fas fa-wallet"></i></div>
                        <div class="stat-value" id="totalAmountPaid">₦0</div>
                        <div class="stat-label">Total Amount Paid</div>
                    </div>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/appointments')); ?>">
                        <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-value" id="clientAppointments">0</div>
                        <div class="stat-label">Scheduled Inspections</div>
                    </div>
                <?php else : ?>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/messages')); ?>">
                        <div class="stat-icon"><i class="fas fa-comments"></i></div>
                        <div class="stat-value" id="agentMessages">0</div>
                        <div class="stat-label">New Messages</div>
                    </div>
                    <div class="stat-card" data-href="<?php echo esc_url(home_url('/dashboard/referrals')); ?>">
                        <div class="stat-icon"><i class="fas fa-users-line"></i></div>
                        <div class="stat-value" id="agentReferrals">0</div>
                        <div class="stat-label">Referrals</div>
                    </div>
                <?php endif; ?>
            </div>

            <div class="dashboard-grid">
                <div class="activity-card">
                    <h2><i class="fas fa-history"></i> Recent Activity</h2>
                    <ul class="activity-list" id="userActivityLog">
                        <li class="activity-item">
                            <div class="activity-text">Loading activity...</div>
                        </li>
                    </ul>
                </div>
                <div class="tasks-card">
                    <h2><i class="fas fa-list-check"></i> Pending Tasks <span id="userTasksBadge" class="badge">0</span></h2>
                    <ul class="activity-list" id="userTasksList">
                        <li class="activity-item">
                            <div class="activity-text">Loading pending tasks...</div>
                        </li>
                    </ul>
                </div>
            </div>
        <?php endif; ?>
    </main>
</div>

<?php
get_footer();
