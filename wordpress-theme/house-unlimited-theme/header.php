<?php
/**
 * Theme header.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

$contact_info = hu_get_contact_info();
$social_links = hu_get_social_links();
$nav_items = [
    ['label' => 'Home', 'url' => home_url('/')],
    ['label' => 'Property', 'url' => home_url('/property')],
    ['label' => 'Blog', 'url' => home_url('/blog')],
    ['label' => 'About Us', 'url' => home_url('/about')],
    ['label' => 'Contact Us', 'url' => home_url('/contact')],
];
$logo_url = HU_THEME_URI . '/assets/img/hun_logo.png';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-gray-50'); ?>>
<?php wp_body_open(); ?>

<div class="bg-slate-900 text-white py-2 text-[10px] uppercase tracking-widest font-bold">
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div class="flex space-x-6">
            <span class="flex items-center">
                <i data-lucide="phone" class="w-4 h-4 mr-2 text-teal-500"></i>
                <?php echo esc_html($contact_info['phone']); ?>
            </span>
            <span class="flex items-center">
                <i data-lucide="mail" class="w-4 h-4 mr-2 text-teal-500"></i>
                <?php echo esc_html($contact_info['email']); ?>
            </span>
        </div>
        <div class="flex space-x-4">
            <a class="hover:text-teal-500 transition-colors" href="<?php echo esc_url($social_links['facebook']); ?>">
                <i data-lucide="facebook" class="w-4 h-4"></i>
            </a>
            <a class="hover:text-teal-500 transition-colors" href="<?php echo esc_url($social_links['twitter']); ?>">
                <i data-lucide="twitter" class="w-4 h-4"></i>
            </a>
            <a class="hover:text-teal-500 transition-colors" href="<?php echo esc_url($social_links['instagram']); ?>">
                <i data-lucide="instagram" class="w-4 h-4"></i>
            </a>
            <a class="hover:text-teal-500 transition-colors" href="<?php echo esc_url($social_links['linkedin']); ?>">
                <i data-lucide="linkedin" class="w-4 h-4"></i>
            </a>
        </div>
    </div>
</div>

<header class="bg-white sticky top-0 z-40 shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-20">
            <div class="flex items-center">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <img src="<?php echo esc_url($logo_url); ?>" alt="<?php bloginfo('name'); ?>" class="h-10 w-auto">
                </a>
            </div>

            <nav class="hidden md:flex space-x-8" aria-label="<?php esc_attr_e('Primary Menu', 'house-unlimited'); ?>">
                <?php foreach ($nav_items as $item) : ?>
                    <a class="capitalize font-medium transition-colors text-gray-600 hover:text-teal-600" href="<?php echo esc_url($item['url']); ?>">
                        <?php echo esc_html($item['label']); ?>
                    </a>
                <?php endforeach; ?>
            </nav>

            <div class="hidden md:flex items-center space-x-4">
                <?php if (is_user_logged_in()) : ?>
                    <?php $current_user = wp_get_current_user(); ?>
                    <div class="flex items-center space-x-4">
                        <div class="text-right">
                            <p class="text-sm font-bold text-gray-900"><?php echo esc_html($current_user->display_name); ?></p>
                            <a href="<?php echo esc_url(wp_logout_url(home_url('/'))); ?>" class="text-xs text-red-500 hover:underline">Sign Out</a>
                        </div>
                        <a href="<?php echo esc_url(home_url('/profile')); ?>" title="<?php esc_attr_e('View profile', 'house-unlimited'); ?>" class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center border border-teal-200 shadow-sm cursor-pointer hover:bg-teal-200 transition-colors">
                            <span class="text-teal-600 font-bold uppercase"><?php echo esc_html(strtoupper(substr($current_user->display_name, 0, 1))); ?></span>
                        </a>
                    </div>
                <?php else : ?>
                    <button type="button" data-hu-auth-open="signin" class="text-gray-600 font-bold hover:text-teal-600 transition-colors text-sm px-4">
                        Sign In
                    </button>
                    <button type="button" data-hu-auth-open="signup" class="bg-teal-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-teal-700 transition-all text-sm shadow-lg shadow-teal-100">
                        Sign Up
                    </button>
                <?php endif; ?>
            </div>

            <div class="md:hidden flex items-center">
                <button data-toggle="hu-mobile-menu" class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <div id="hu-mobile-menu" class="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden hidden">
        <div class="px-4 py-6 space-y-6">
            <div class="flex flex-col space-y-4">
                <?php foreach ($nav_items as $item) : ?>
                    <a class="text-left text-lg font-semibold py-2 px-4 rounded-xl transition-colors text-gray-600 hover:bg-gray-50" href="<?php echo esc_url($item['url']); ?>">
                        <?php echo esc_html($item['label']); ?>
                    </a>
                <?php endforeach; ?>
            </div>
            <div class="pt-6 border-t border-gray-100">
                <?php if (is_user_logged_in()) : ?>
                    <?php $current_user = wp_get_current_user(); ?>
                    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                        <a href="<?php echo esc_url(home_url('/profile')); ?>" class="flex items-center space-x-3 text-left hover:opacity-90 transition-opacity">
                            <div class="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                                <?php echo esc_html(strtoupper(substr($current_user->display_name, 0, 1))); ?>
                            </div>
                            <div>
                                <p class="font-bold text-gray-900"><?php echo esc_html($current_user->display_name); ?></p>
                                <p class="text-xs text-gray-500"><?php echo esc_html($current_user->user_email); ?></p>
                            </div>
                        </a>
                        <a href="<?php echo esc_url(wp_logout_url(home_url('/'))); ?>" class="text-red-500 font-bold text-sm hover:underline">Logout</a>
                    </div>
                <?php else : ?>
                    <div class="grid grid-cols-2 gap-4">
                        <button type="button" data-hu-auth-open="signin" class="w-full py-3 px-4 text-center font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                            Sign In
                        </button>
                        <button type="button" data-hu-auth-open="signup" class="w-full py-3 px-4 text-center font-bold text-white bg-teal-600 rounded-xl shadow-lg shadow-teal-200">
                            Sign Up
                        </button>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</header>

<?php
$current_url = (is_ssl() ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$login_form = wp_login_form([
    'echo' => false,
    'redirect' => $current_url,
    'remember' => true,
    'label_username' => __('Email or Username', 'house-unlimited'),
    'label_password' => __('Password', 'house-unlimited'),
    'label_remember' => __('Remember me', 'house-unlimited'),
    'label_log_in' => __('Sign In', 'house-unlimited'),
]);
?>

<div id="hu-auth-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
        <button type="button" data-hu-auth-close class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="<?php esc_attr_e('Close', 'house-unlimited'); ?>">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center justify-between mb-6">
            <div>
                <p class="text-xs font-bold uppercase tracking-widest text-teal-600">Welcome Back</p>
                <h3 class="text-2xl font-bold text-gray-900">Account Access</h3>
            </div>
            <img src="<?php echo esc_url($logo_url); ?>" alt="<?php bloginfo('name'); ?>" class="h-8 w-auto">
        </div>
        <div class="grid grid-cols-2 gap-3 mb-8">
            <button type="button" data-hu-auth-tab="signin" class="hu-auth-tab px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:text-teal-600">Sign In</button>
            <button type="button" data-hu-auth-tab="signup" class="hu-auth-tab px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:text-teal-600">Sign Up</button>
        </div>

        <div data-hu-auth-panel="signin" class="hu-auth-panel">
            <?php echo $login_form; ?>
            <div class="flex justify-between items-center mt-4 text-sm">
                <a class="text-teal-600 font-semibold hover:underline" href="<?php echo esc_url(wp_lostpassword_url()); ?>">Forgot password?</a>
                <button type="button" data-hu-auth-tab="signup" class="text-gray-500 hover:text-teal-600">Need an account?</button>
            </div>
        </div>

        <div data-hu-auth-panel="signup" class="hu-auth-panel hidden">
            <?php if (get_option('users_can_register')) : ?>
                <form method="post" action="<?php echo esc_url(site_url('wp-login.php?action=register', 'login_post')); ?>" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="hu-user-login"><?php esc_html_e('Username', 'house-unlimited'); ?></label>
                        <input id="hu-user-login" name="user_login" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="hu-user-email"><?php esc_html_e('Email', 'house-unlimited'); ?></label>
                        <input id="hu-user-email" name="user_email" type="email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200">
                    </div>
                    <?php wp_nonce_field('register', 'register_nonce'); ?>
                    <button type="submit" class="w-full bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all text-sm shadow-lg shadow-teal-100">
                        Create Account
                    </button>
                </form>
                <p class="text-xs text-gray-500 mt-4">
                    <?php esc_html_e('A password will be emailed to you after registration.', 'house-unlimited'); ?>
                </p>
            <?php else : ?>
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-sm text-gray-600">
                    <?php esc_html_e('Registration is currently disabled. Please contact the site administrator.', 'house-unlimited'); ?>
                </div>
            <?php endif; ?>
            <div class="mt-4 text-sm">
                <button type="button" data-hu-auth-tab="signin" class="text-teal-600 font-semibold hover:underline">Already have an account?</button>
            </div>
        </div>
    </div>
</div>
