<?php
/**
 * Dashboard sidebar.
 *
 * @package HouseUnlimitedDashboard
 */

if (!defined('ABSPATH')) {
    exit;
}

$current_user = wp_get_current_user();
$role = hud_get_user_role_key($current_user);
$theme = $_COOKIE['theme'] ?? 'light';
$base_url = home_url();

$current_path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '', '/');

$is_active = function (array $slugs) use ($current_path): bool {
    foreach ($slugs as $slug) {
        $slug = trim($slug, '/');
        if ($slug !== '' && strpos($current_path, $slug) !== false) {
            return true;
        }
    }
    return false;
};

function hud_sidebar_icon(string $name): string
{
    $icons = [
        'dashboard'     => '<i class="fas fa-gauge-high"></i>',
        'properties'    => '<i class="fas fa-building"></i>',
        'my-properties' => '<i class="fas fa-house-user"></i>',
        'appointments'  => '<i class="fas fa-calendar-check"></i>',
        'withdrawals'   => '<i class="fas fa-money-bill-transfer"></i>',
        'messages'      => '<i class="fas fa-comments"></i>',
        'documents'     => '<i class="fas fa-file-lines"></i>',
        'payments'      => '<i class="fas fa-credit-card"></i>',
        'progress'      => '<i class="fas fa-spinner"></i>',
        'profile'       => '<i class="fas fa-user"></i>',
        'admin'         => '<i class="fas fa-screwdriver-wrench"></i>',
        'users'         => '<i class="fas fa-users"></i>',
        'referrals'     => '<i class="fas fa-users-line"></i>',
        'wallet'        => '<i class="fas fa-wallet"></i>',
        'settings'      => '<i class="fas fa-gear"></i>',
        'reports'       => '<i class="fas fa-chart-line"></i>',
        'tasks'         => '<i class="fas fa-list-check"></i>',
        'upsell'        => '<i class="fas fa-tags"></i>',
    ];
    return $icons[$name] ?? '';
}

$sidebar_links = [
    [
        'url' => $base_url . '/dashboard',
        'icon' => 'dashboard',
        'label' => 'Dashboard',
        'active_on' => ['dashboard'],
        'roles' => ['admin', 'agent', 'client'],
    ],
    [
        'label' => 'Properties Management',
        'icon' => 'properties',
        'type' => 'dropdown',
        'roles' => ['admin', 'agent', 'client'],
        'active_on' => ['properties', 'my-properties', 'property', 'listings-progress'],
        'submenu' => [
            ['url' => $base_url . '/dashboard/my-properties', 'icon' => 'my-properties', 'label' => 'My Properties', 'active_on' => ['my-properties'], 'roles' => ['client']],
            ['url' => $base_url . '/dashboard/properties', 'icon' => 'properties', 'label' => 'Available Properties', 'active_on' => ['properties'], 'roles' => ['admin', 'agent', 'client']],
            ['url' => $base_url . '/dashboard/add-property', 'icon' => 'properties', 'label' => 'Add Property', 'active_on' => ['add-property'], 'roles' => ['admin', 'agent']],
            ['url' => $base_url . '/dashboard/listings-progress', 'icon' => 'progress', 'label' => 'My Listings Progress', 'active_on' => ['listings-progress'], 'roles' => ['agent']],
        ],
    ],
    [
        'label' => 'Investment Portfolio',
        'icon' => 'payments',
        'type' => 'dropdown',
        'roles' => ['admin', 'agent', 'client'],
        'active_on' => ['payments', 'withdrawals', 'payment-plans', 'investor-deals'],
        'submenu' => [
            ['url' => $base_url . '/dashboard/payments', 'icon' => 'payments', 'label' => 'Payments & Transactions', 'active_on' => ['payments'], 'roles' => ['admin', 'agent', 'client']],
            ['url' => $base_url . '/dashboard/investor-deals', 'icon' => 'upsell', 'label' => 'Investor Deals', 'active_on' => ['investor-deals'], 'roles' => ['client']],
            ['url' => $base_url . '/dashboard/payment-plans', 'icon' => 'payments', 'label' => 'Payment Plans', 'active_on' => ['payment-plans'], 'roles' => ['admin']],
        ],
    ],
    ['url' => $base_url . '/dashboard/documents', 'icon' => 'documents', 'label' => 'Documents', 'active_on' => ['documents'], 'roles' => ['admin', 'agent', 'client']],
    ['url' => $base_url . '/dashboard/appointments', 'icon' => 'appointments', 'label' => 'Inspections', 'active_on' => ['appointments'], 'roles' => ['admin', 'agent', 'client']],
    ['url' => $base_url . '/dashboard/messages', 'icon' => 'messages', 'label' => 'Messages', 'active_on' => ['messages'], 'roles' => ['admin', 'agent', 'client']],
    ['url' => $base_url . '/dashboard/tasks', 'icon' => 'tasks', 'label' => 'Tasks', 'active_on' => ['tasks'], 'roles' => ['admin', 'agent']],
    ['url' => $base_url . '/dashboard/referrals', 'icon' => 'referrals', 'label' => 'Referrals', 'active_on' => ['referrals'], 'roles' => ['admin', 'agent', 'client']],
    [
        'label' => 'Admin Tools',
        'icon' => 'admin',
        'type' => 'dropdown',
        'roles' => ['admin'],
        'active_on' => ['users', 'kyc', 'allocations', 'offers', 'upsell', 'reports', 'settings'],
        'submenu' => [
            ['url' => $base_url . '/dashboard/users', 'icon' => 'users', 'label' => 'Manage Users', 'active_on' => ['users'], 'roles' => ['admin']],
            ['url' => $base_url . '/dashboard/kyc', 'icon' => 'documents', 'label' => 'Manage KYC', 'active_on' => ['kyc'], 'roles' => ['admin']],
            ['url' => $base_url . '/dashboard/allocations', 'icon' => 'my-properties', 'label' => 'Allocations', 'active_on' => ['allocations'], 'roles' => ['admin']],
            ['url' => $base_url . '/dashboard/offers', 'icon' => 'payments', 'label' => 'Manage Offers', 'active_on' => ['offers'], 'roles' => ['admin']],
            ['url' => $base_url . '/dashboard/upsell', 'icon' => 'upsell', 'label' => 'Upsell Campaigns', 'active_on' => ['upsell'], 'roles' => ['admin']],
            ['url' => $base_url . '/dashboard/reports', 'icon' => 'reports', 'label' => 'Reports', 'active_on' => ['reports'], 'roles' => ['admin']],
            ['url' => $base_url . '/dashboard/settings', 'icon' => 'settings', 'label' => 'System Settings', 'active_on' => ['settings'], 'roles' => ['admin']],
        ],
    ],
    ['url' => $base_url . '/profile', 'icon' => 'profile', 'label' => 'Profile', 'active_on' => ['profile'], 'roles' => ['admin', 'agent', 'client']],
];
?>

<aside class="sidebar">
    <div class="logo">
        <img src="<?php echo esc_url(HUD_THEME_URI . '/assets/img/logo.png'); ?>" alt="Logo" class="logo-icon">
        <button class="sidebar-toggle-btn"><i class="fas fa-bars"></i></button>
    </div>

    <nav class="nav">
        <?php foreach ($sidebar_links as $index => $link) : ?>
            <?php if (!in_array($role, $link['roles'], true)) { continue; } ?>
            <?php
            $is_link_active = false;
            if (!empty($link['active_on'])) {
                $is_link_active = $is_active((array) $link['active_on']);
            }
            if (!empty($link['submenu'])) {
                foreach ($link['submenu'] as $sub_link) {
                    if (in_array($role, $sub_link['roles'], true) && $is_active((array) $sub_link['active_on'])) {
                        $is_link_active = true;
                        break;
                    }
                }
            }
            $active_class = $is_link_active ? 'active' : '';
            ?>

            <?php if (!empty($link['type']) && $link['type'] === 'dropdown') : ?>
                <?php $submenu_id = 'sidebar-submenu-' . $index; ?>
                <li class="has-submenu <?php echo esc_attr($active_class); ?>">
                    <a href="#" class="menu-item dropdown-toggle <?php echo esc_attr($active_class); ?>" aria-expanded="<?php echo $is_link_active ? 'true' : 'false'; ?>" aria-controls="<?php echo esc_attr($submenu_id); ?>" aria-haspopup="true">
                        <div>
                            <?php echo hud_sidebar_icon($link['icon']); ?>
                            <span><?php echo esc_html($link['label']); ?></span>
                        </div>
                        <i class="fas fa-angle-down dropdown-arrow"></i>
                    </a>
                    <ul id="<?php echo esc_attr($submenu_id); ?>" class="submenu <?php echo $is_link_active ? 'expanded' : ''; ?>">
                        <?php foreach ($link['submenu'] as $sub_link) : ?>
                            <?php if (!in_array($role, $sub_link['roles'], true)) { continue; } ?>
                            <?php $sub_active = $is_active((array) $sub_link['active_on']) ? 'active' : ''; ?>
                            <li>
                                <a href="<?php echo esc_url($sub_link['url']); ?>" class="menu-item <?php echo esc_attr($sub_active); ?>">
                                    <?php echo hud_sidebar_icon($sub_link['icon']); ?>
                                    <span><?php echo esc_html($sub_link['label']); ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </li>
            <?php else : ?>
                <li>
                    <a href="<?php echo esc_url($link['url']); ?>" class="menu-item <?php echo esc_attr($active_class); ?>">
                        <?php echo hud_sidebar_icon($link['icon']); ?>
                        <span><?php echo esc_html($link['label']); ?></span>
                    </a>
                </li>
            <?php endif; ?>
        <?php endforeach; ?>
    </nav>

    <div class="theme-toggle">
        <div class="theme-btn light <?php echo $theme === 'light' ? 'active' : ''; ?>" data-theme="light">
            <i class="fas fa-sun"></i> Light
        </div>
        <div class="theme-btn dark <?php echo $theme === 'dark' ? 'active' : ''; ?>" data-theme="dark">
            <i class="fas fa-moon"></i> Dark
        </div>
    </div>

    <div class="sidebar-footer">
        <div class="location">
            <small>Abuja, Nigeria</small><br>
            <span><?php echo esc_html(date('D, M j • h:i A')); ?></span>
        </div>
    </div>
</aside>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;

    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme');
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            htmlElement.setAttribute('data-theme', selectedTheme);
            document.cookie = 'theme=' + selectedTheme + '; path=/; max-age=31536000; SameSite=Lax';
        });
    });
});
</script>
