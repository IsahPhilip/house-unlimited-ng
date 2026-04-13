<?php
/**
 * Dashboard header.
 *
 * @package HouseUnlimitedDashboard
 */

if (!defined('ABSPATH')) {
    exit;
}

$current_user = wp_get_current_user();
$role = hud_get_user_role_key($current_user);
$display_name = hud_get_user_display_name($current_user);
$avatar_url = $current_user->ID ? get_avatar_url($current_user->ID, ['size' => 96]) : HUD_THEME_URI . '/assets/uploads/avatars/default_avatar.png';
?>

<header class="header">
    <button class="icon-btn mobile-sidebar-toggle">
        <i class="fas fa-bars"></i>
    </button>
    <div class="search-container">
        <form id="globalSearchForm">
            <i class="fas fa-search search-icon"></i>
            <input type="text" name="q" class="search-input" placeholder="Search for properties, users, etc...">
        </form>
    </div>
    <div class="header-actions">
        <div class="notification-menu">
            <button class="icon-btn notification-badge" title="Notifications">
                <i class="fas fa-bell"></i>
            </button>
            <div class="dropdown-menu notification-dropdown">
                <div class="notification-header">
                    <h4>Notifications</h4>
                </div>
                <div class="notification-list">
                    <div class="notification-item">No notifications yet.</div>
                </div>
                <div class="notification-footer">
                    <a href="<?php echo esc_url(home_url('/notifications')); ?>">View all notifications</a>
                </div>
            </div>
        </div>

        <div class="user-menu">
            <button class="user-toggle">
                <div class="user-avatar">
                    <img src="<?php echo esc_url($avatar_url); ?>" alt="<?php echo esc_attr($display_name); ?>">
                </div>
                <div class="user-info">
                    <div class="user-name"><?php echo esc_html($display_name); ?></div>
                    <div class="user-role"><?php echo esc_html($role === 'admin' ? 'Administrator' : ucfirst($role)); ?></div>
                </div>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>

            <div class="dropdown-menu">
                <a href="<?php echo esc_url(home_url('/profile')); ?>"><i class="fas fa-user"></i> My Profile</a>
                <a href="<?php echo esc_url(home_url('/favorites')); ?>"><i class="fas fa-heart"></i> Favorites</a>
                <?php if ($role === 'admin') : ?>
                    <a href="<?php echo esc_url(home_url('/settings')); ?>"><i class="fas fa-cog"></i> Settings</a>
                <?php endif; ?>
                <div class="dropdown-divider"></div>
                <a href="<?php echo esc_url(wp_logout_url(home_url('/'))); ?>"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </div>
    </div>
</header>

<script>
document.getElementById('globalSearchForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = this.querySelector('input[name="q"]').value;
    if (query) {
        window.location.href = '<?php echo esc_url(home_url('/dashboard/search')); ?>?q=' + encodeURIComponent(query);
    }
});

document.querySelector('.user-toggle')?.addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelector('.user-menu')?.classList.toggle('open');
});

document.addEventListener('click', () => {
    document.querySelector('.user-menu')?.classList.remove('open');
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelector('.user-menu')?.classList.remove('open');
});
</script>
