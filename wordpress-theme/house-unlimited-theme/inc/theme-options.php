<?php
/**
 * Theme option helpers.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

function hu_get_contact_info(): array
{
    return [
        'phone' => get_theme_mod('hu_phone', '+234 904 375 2708'),
        'email' => get_theme_mod('hu_email', 'official@houseunlimitednigeria.com'),
        'address' => get_theme_mod('hu_address', 'Suite S23 Febson Mall, Wuse Zone 4, Abuja 904101, Federal Capital Territory, Nigeria'),
    ];
}

function hu_get_social_links(): array
{
    return [
        'facebook' => get_theme_mod('hu_social_facebook', '#'),
        'twitter' => get_theme_mod('hu_social_twitter', '#'),
        'instagram' => get_theme_mod('hu_social_instagram', '#'),
        'linkedin' => get_theme_mod('hu_social_linkedin', '#'),
    ];
}

function hu_customize_register(WP_Customize_Manager $wp_customize): void
{
    $wp_customize->add_section('hu_contact_section', [
        'title' => __('House Unlimited Theme Settings', 'house-unlimited'),
        'priority' => 30,
    ]);

    $fields = [
        'hu_phone' => ['label' => __('Phone Number', 'house-unlimited'), 'default' => '+234 904 375 2708'],
        'hu_email' => ['label' => __('Email Address', 'house-unlimited'), 'default' => 'official@houseunlimitednigeria.com'],
        'hu_address' => ['label' => __('Office Address', 'house-unlimited'), 'default' => 'Suite S23 Febson Mall, Wuse Zone 4, Abuja 904101, Federal Capital Territory, Nigeria'],
        'hu_social_facebook' => ['label' => __('Facebook URL', 'house-unlimited'), 'default' => '#'],
        'hu_social_twitter' => ['label' => __('Twitter URL', 'house-unlimited'), 'default' => '#'],
        'hu_social_instagram' => ['label' => __('Instagram URL', 'house-unlimited'), 'default' => '#'],
        'hu_social_linkedin' => ['label' => __('LinkedIn URL', 'house-unlimited'), 'default' => '#'],
    ];

    foreach ($fields as $setting_id => $config) {
        $wp_customize->add_setting($setting_id, [
            'default' => $config['default'],
            'sanitize_callback' => 'sanitize_text_field',
        ]);

        $wp_customize->add_control($setting_id, [
            'label' => $config['label'],
            'section' => 'hu_contact_section',
            'type' => 'text',
        ]);
    }
}
add_action('customize_register', 'hu_customize_register');
