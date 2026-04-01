<?php
/**
 * ACF options and field configurations.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

// Check if ACF is active
if (function_exists('acf_add_options_page')) {

    // Add main options page
    acf_add_options_page([
        'page_title' => 'Theme Options',
        'menu_title' => 'Theme Options',
        'menu_slug' => 'theme-options',
        'capability' => 'edit_posts',
        'redirect' => false,
    ]);

    // Add homepage options sub page
    acf_add_options_sub_page([
        'page_title' => 'Homepage Settings',
        'menu_title' => 'Homepage',
        'parent_slug' => 'theme-options',
    ]);

    // Add about page options
    acf_add_options_sub_page([
        'page_title' => 'About Page Settings',
        'menu_title' => 'About Page',
        'parent_slug' => 'theme-options',
    ]);

    // Add contact page options
    acf_add_options_sub_page([
        'page_title' => 'Contact Page Settings',
        'menu_title' => 'Contact Page',
        'parent_slug' => 'theme-options',
    ]);
}

// Add ACF fields for homepage
function hu_register_acf_fields(): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    // Homepage Hero Section
    acf_add_local_field_group([
        'key' => 'group_homepage_hero',
        'title' => 'Homepage Hero Section',
        'fields' => [
            [
                'key' => 'field_hero_badge',
                'label' => 'Hero Badge',
                'name' => 'hero_badge',
                'type' => 'text',
                'default_value' => 'Find Your Dream Property Easily',
            ],
            [
                'key' => 'field_hero_title',
                'label' => 'Hero Title',
                'name' => 'hero_title',
                'type' => 'text',
                'default_value' => 'Instant Property Deals: Buy and Sell',
            ],
            [
                'key' => 'field_hero_text',
                'label' => 'Hero Text',
                'name' => 'hero_text',
                'type' => 'textarea',
                'default_value' => 'Experience the next generation of real estate discovery with verified listings, curated guidance, and a premium property experience.',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'acf-options-homepage',
                ],
            ],
        ],
    ]);

    // Homepage Services Section
    acf_add_local_field_group([
        'key' => 'group_homepage_services',
        'title' => 'Homepage Services Section',
        'fields' => [
            [
                'key' => 'field_services_title',
                'label' => 'Services Title',
                'name' => 'services_title',
                'type' => 'text',
                'default_value' => 'Our Services',
            ],
            [
                'key' => 'field_services',
                'label' => 'Services',
                'name' => 'services',
                'type' => 'repeater',
                'sub_fields' => [
                    [
                        'key' => 'field_service_icon',
                        'label' => 'Icon',
                        'name' => 'icon',
                        'type' => 'text',
                    ],
                    [
                        'key' => 'field_service_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                    ],
                    [
                        'key' => 'field_service_description',
                        'label' => 'Description',
                        'name' => 'description',
                        'type' => 'textarea',
                    ],
                ],
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'acf-options-homepage',
                ],
            ],
        ],
    ]);

    // Homepage Testimonials
    acf_add_local_field_group([
        'key' => 'group_homepage_testimonials',
        'title' => 'Homepage Testimonials',
        'fields' => [
            [
                'key' => 'field_testimonials_title',
                'label' => 'Testimonials Title',
                'name' => 'testimonials_title',
                'type' => 'text',
                'default_value' => 'What Our Clients Say',
            ],
            [
                'key' => 'field_testimonials',
                'label' => 'Testimonials',
                'name' => 'testimonials',
                'type' => 'repeater',
                'sub_fields' => [
                    [
                        'key' => 'field_testimonial_quote',
                        'label' => 'Quote',
                        'name' => 'quote',
                        'type' => 'textarea',
                    ],
                    [
                        'key' => 'field_testimonial_author',
                        'label' => 'Author',
                        'name' => 'author',
                        'type' => 'text',
                    ],
                    [
                        'key' => 'field_testimonial_role',
                        'label' => 'Role',
                        'name' => 'role',
                        'type' => 'text',
                    ],
                ],
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'acf-options-homepage',
                ],
            ],
        ],
    ]);

    // About Page Fields
    acf_add_local_field_group([
        'key' => 'group_about_page',
        'title' => 'About Page Content',
        'fields' => [
            [
                'key' => 'field_about_badge',
                'label' => 'About Badge',
                'name' => 'about_badge',
                'type' => 'text',
                'default_value' => 'About House Unlimited',
            ],
            [
                'key' => 'field_about_title',
                'label' => 'About Title',
                'name' => 'about_title',
                'type' => 'text',
                'default_value' => 'Your Trusted Real Estate Partner',
            ],
            [
                'key' => 'field_about_content',
                'label' => 'About Content',
                'name' => 'about_content',
                'type' => 'wysiwyg',
            ],
            [
                'key' => 'field_about_image',
                'label' => 'About Image',
                'name' => 'about_image',
                'type' => 'image',
            ],
            [
                'key' => 'field_about_stats',
                'label' => 'Statistics',
                'name' => 'about_stats',
                'type' => 'repeater',
                'sub_fields' => [
                    [
                        'key' => 'field_stat_number',
                        'label' => 'Number',
                        'name' => 'number',
                        'type' => 'text',
                    ],
                    [
                        'key' => 'field_stat_label',
                        'label' => 'Label',
                        'name' => 'label',
                        'type' => 'text',
                    ],
                ],
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'acf-options-about-page',
                ],
            ],
        ],
    ]);

    // Contact Page Fields
    acf_add_local_field_group([
        'key' => 'group_contact_page',
        'title' => 'Contact Page Content',
        'fields' => [
            [
                'key' => 'field_contact_title',
                'label' => 'Contact Title',
                'name' => 'contact_title',
                'type' => 'text',
                'default_value' => 'Get In Touch',
            ],
            [
                'key' => 'field_contact_subtitle',
                'label' => 'Contact Subtitle',
                'name' => 'contact_subtitle',
                'type' => 'textarea',
                'default_value' => 'Ready to find your dream property? Contact us today.',
            ],
            [
                'key' => 'field_office_hours',
                'label' => 'Office Hours',
                'name' => 'office_hours',
                'type' => 'repeater',
                'sub_fields' => [
                    [
                        'key' => 'field_day',
                        'label' => 'Day',
                        'name' => 'day',
                        'type' => 'text',
                    ],
                    [
                        'key' => 'field_hours',
                        'label' => 'Hours',
                        'name' => 'hours',
                        'type' => 'text',
                    ],
                ],
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'acf-options-contact-page',
                ],
            ],
        ],
    ]);
}
add_action('acf/init', 'hu_register_acf_fields');

// Helper functions to get ACF option values
function hu_get_option($key, $default = '') {
    if (function_exists('get_field')) {
        return get_field($key, 'option') ?: $default;
    }
    return $default;
}

function hu_the_option($key, $default = '') {
    echo esc_html(hu_get_option($key, $default));
}