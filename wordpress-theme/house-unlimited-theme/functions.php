<?php
/**
 * Theme bootstrap for House Unlimited Theme.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HU_THEME_VERSION', '0.1.0');
define('HU_THEME_DIR', get_template_directory());
define('HU_THEME_URI', get_template_directory_uri());

require_once HU_THEME_DIR . '/inc/setup.php';
require_once HU_THEME_DIR . '/inc/enqueue.php';
require_once HU_THEME_DIR . '/inc/theme-options.php';
require_once HU_THEME_DIR . '/inc/acf-options.php';
require_once HU_THEME_DIR . '/inc/template-tags.php';
