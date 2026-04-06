<?php
/**
 * Theme footer.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

$contact_info = hu_get_contact_info();
$social_links = hu_get_social_links();
$logo_url = HU_THEME_URI . '/assets/img/hun_logo.png';
?>
<footer class="bg-slate-900 text-white pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="space-y-4">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center">
                <img src="<?php echo esc_url($logo_url); ?>" alt="<?php bloginfo('name'); ?>" class="h-8 w-auto mr-2">
            </a>
            <p class="text-gray-400 text-sm"><?php echo esc_html(get_theme_mod('hu_footer_description', 'Empowering home seekers with expert human guidance since 1995.')); ?></p>
            <div class="flex space-x-4">
                <a class="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-teal-600 transition-colors" href="<?php echo esc_url($social_links['facebook']); ?>">
                    <i data-lucide="facebook" class="w-4 h-4"></i>
                </a>
                <a class="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-teal-600 transition-colors" href="<?php echo esc_url($social_links['twitter']); ?>">
                    <i data-lucide="twitter" class="w-4 h-4"></i>
                </a>
                <a class="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-teal-600 transition-colors" href="<?php echo esc_url($social_links['linkedin']); ?>">
                    <i data-lucide="linkedin" class="w-4 h-4"></i>
                </a>
            </div>
        </div>
        <div>
            <h4 class="font-bold mb-6">Company</h4>
            <ul class="space-y-3 text-gray-400 text-sm">
                <li><a class="hover:text-teal-400" href="<?php echo esc_url(home_url('/agents')); ?>">Our Agents</a></li>
                <li><a class="hover:text-teal-400" href="<?php echo esc_url(home_url('/faq')); ?>">FAQs</a></li>
                <li><a class="hover:text-teal-400" href="<?php echo esc_url(home_url('/')); ?>">Testimonial</a></li>
                <li><a class="hover:text-teal-400" href="<?php echo esc_url(home_url('/about')); ?>">About Us</a></li>
                <li><a class="hover:text-teal-400" href="<?php echo esc_url(home_url('/contact')); ?>">Contact Us</a></li>
            </ul>
        </div>
        <div>
            <h4 class="font-bold mb-6">Contact</h4>
            <ul class="space-y-3 text-gray-400 text-sm">
                <li class="flex items-center"><i data-lucide="phone" class="w-4 h-4 mr-2 text-teal-500"></i> <?php echo esc_html($contact_info['phone']); ?></li>
                <li class="flex items-center"><i data-lucide="mail" class="w-4 h-4 mr-2 text-teal-500"></i> <?php echo esc_html($contact_info['email']); ?></li>
                <li class="flex items-center"><i data-lucide="map-pin" class="w-4 h-4 mr-2 text-teal-500"></i> <?php echo esc_html($contact_info['address']); ?></li>
            </ul>
        </div>
        <div>
            <h4 class="font-bold mb-6">Get the latest information</h4>
            <div class="relative">
                <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                    <?php wp_nonce_field('hu_newsletter_subscribe', 'hu_newsletter_nonce'); ?>
                    <input type="hidden" name="action" value="hu_newsletter_subscribe">
                    <input type="email" name="newsletter_email" placeholder="Email address" class="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-teal-600 outline-none">
                    <button type="submit" class="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-teal-600 hover:bg-teal-700 transition-colors">
                        <i data-lucide="send" class="w-4 h-4"></i>
                    </button>
                </form>
            </div>
            <?php if (!empty($_GET['newsletter'])) : ?>
                <?php
                $newsletter_status = sanitize_text_field($_GET['newsletter']);
                $newsletter_message = '';
                if ($newsletter_status === 'success') {
                    $newsletter_message = 'Thanks for subscribing.';
                } elseif ($newsletter_status === 'exists') {
                    $newsletter_message = 'You are already subscribed.';
                } elseif ($newsletter_status === 'invalid') {
                    $newsletter_message = 'Please enter a valid email.';
                } elseif ($newsletter_status === 'security') {
                    $newsletter_message = 'Security check failed. Please try again.';
                } else {
                    $newsletter_message = 'Unable to subscribe right now.';
                }
                ?>
                <p class="text-xs text-teal-200 mt-3"><?php echo esc_html($newsletter_message); ?></p>
            <?php endif; ?>
        </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-gray-500 text-xs text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-3">
            <img src="<?php echo esc_url($logo_url); ?>" alt="<?php bloginfo('name'); ?>" class="h-5 w-auto opacity-70">
            <span><?php echo esc_html(get_theme_mod('hu_footer_copyright', '© 2024 All Rights Reserved.')); ?></span>
        </div>
        <div class="space-x-6 mt-4 md:mt-0">
            <a class="hover:text-white" href="<?php echo esc_url(home_url('/terms')); ?>">User Terms &amp; Conditions</a>
            <a class="hover:text-white" href="<?php echo esc_url(home_url('/privacy')); ?>">Privacy Policy</a>
        </div>
    </div>
    <?php wp_footer(); ?>
</footer>
</body>
</html>
