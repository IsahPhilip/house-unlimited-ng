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
?>
<footer class="hu-site-footer">
    <div class="hu-container hu-site-footer__inner">
        <div>
            <h2 class="hu-site-brand"><?php bloginfo('name'); ?></h2>
            <p><?php echo esc_html($contact_info['address']); ?></p>
        </div>

        <div>
            <?php
            wp_nav_menu([
                'theme_location' => 'footer',
                'container' => false,
                'menu_class' => 'hu-nav-menu',
                'fallback_cb' => false,
            ]);
            ?>
        </div>

        <div>
            <p><strong><?php esc_html_e('Phone:', 'house-unlimited'); ?></strong> <?php echo esc_html($contact_info['phone']); ?></p>
            <p><strong><?php esc_html_e('Email:', 'house-unlimited'); ?></strong> <?php echo esc_html($contact_info['email']); ?></p>
        </div>
    </div>
    <?php wp_footer(); ?>
</footer>
</body>
</html>
