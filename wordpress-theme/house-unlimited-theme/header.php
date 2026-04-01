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
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="hu-site-topbar">
    <div class="hu-container hu-site-topbar__inner">
        <div>
            <span><?php echo esc_html($contact_info['phone']); ?></span>
            <span> • </span>
            <span><?php echo esc_html($contact_info['email']); ?></span>
        </div>
        <div>
            <a href="<?php echo esc_url($social_links['facebook']); ?>">Facebook</a>
            <span> • </span>
            <a href="<?php echo esc_url($social_links['twitter']); ?>">Twitter</a>
            <span> • </span>
            <a href="<?php echo esc_url($social_links['instagram']); ?>">Instagram</a>
            <span> • </span>
            <a href="<?php echo esc_url($social_links['linkedin']); ?>">LinkedIn</a>
        </div>
    </div>
</div>

<header class="hu-site-header">
    <div class="hu-container hu-site-header__inner">
        <div class="hu-site-brand">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <?php bloginfo('name'); ?>
                <?php endif; ?>
            </a>
        </div>

        <nav aria-label="<?php esc_attr_e('Primary Menu', 'house-unlimited'); ?>">
            <?php
            wp_nav_menu([
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'hu-nav-menu',
                'fallback_cb' => false,
            ]);
            ?>
        </nav>
    </div>
</header>
