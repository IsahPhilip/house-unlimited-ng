<?php
/**
 * Theme header.
 *
 * @package HouseUnlimitedDashboard
 */

if (!defined('ABSPATH')) {
    exit;
}

$theme = $_COOKIE['theme'] ?? 'light';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> data-theme="<?php echo esc_attr($theme); ?>">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
