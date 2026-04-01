<?php
/**
 * Custom post types and taxonomies.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

function hu_register_post_types(): void
{
    register_post_type('property', [
        'labels' => [
            'name' => __('Properties', 'house-unlimited'),
            'singular_name' => __('Property', 'house-unlimited'),
            'menu_name' => __('Properties', 'house-unlimited'),
            'name_admin_bar' => __('Property', 'house-unlimited'),
            'add_new' => __('Add New', 'house-unlimited'),
            'add_new_item' => __('Add New Property', 'house-unlimited'),
            'edit_item' => __('Edit Property', 'house-unlimited'),
            'new_item' => __('New Property', 'house-unlimited'),
            'view_item' => __('View Property', 'house-unlimited'),
            'view_items' => __('View Properties', 'house-unlimited'),
            'search_items' => __('Search Properties', 'house-unlimited'),
            'not_found' => __('No properties found.', 'house-unlimited'),
            'not_found_in_trash' => __('No properties found in Trash.', 'house-unlimited'),
            'all_items' => __('All Properties', 'house-unlimited'),
            'archives' => __('Property Archives', 'house-unlimited'),
            'attributes' => __('Property Attributes', 'house-unlimited'),
            'insert_into_item' => __('Insert into property', 'house-unlimited'),
            'uploaded_to_this_item' => __('Uploaded to this property', 'house-unlimited'),
            'featured_image' => __('Property Image', 'house-unlimited'),
            'set_featured_image' => __('Set property image', 'house-unlimited'),
            'remove_featured_image' => __('Remove property image', 'house-unlimited'),
            'use_featured_image' => __('Use as property image', 'house-unlimited'),
            'filter_items_list' => __('Filter properties list', 'house-unlimited'),
            'items_list_navigation' => __('Properties list navigation', 'house-unlimited'),
            'items_list' => __('Properties list', 'house-unlimited'),
        ],
        'public' => true,
        'has_archive' => 'property',
        'rewrite' => [
            'slug' => 'property',
            'with_front' => false,
        ],
        'menu_icon' => 'dashicons-building',
        'supports' => [
            'title',
            'editor',
            'excerpt',
            'thumbnail',
            'revisions',
        ],
        'show_in_rest' => true,
    ]);

    register_post_type('agent', [
        'labels' => [
            'name' => __('Agents', 'house-unlimited'),
            'singular_name' => __('Agent', 'house-unlimited'),
            'menu_name' => __('Agents', 'house-unlimited'),
            'name_admin_bar' => __('Agent', 'house-unlimited'),
            'add_new' => __('Add New', 'house-unlimited'),
            'add_new_item' => __('Add New Agent', 'house-unlimited'),
            'edit_item' => __('Edit Agent', 'house-unlimited'),
            'new_item' => __('New Agent', 'house-unlimited'),
            'view_item' => __('View Agent', 'house-unlimited'),
            'view_items' => __('View Agents', 'house-unlimited'),
            'search_items' => __('Search Agents', 'house-unlimited'),
            'not_found' => __('No agents found.', 'house-unlimited'),
            'not_found_in_trash' => __('No agents found in Trash.', 'house-unlimited'),
            'all_items' => __('All Agents', 'house-unlimited'),
            'archives' => __('Agent Archives', 'house-unlimited'),
            'attributes' => __('Agent Attributes', 'house-unlimited'),
            'insert_into_item' => __('Insert into agent', 'house-unlimited'),
            'uploaded_to_this_item' => __('Uploaded to this agent', 'house-unlimited'),
            'featured_image' => __('Agent Image', 'house-unlimited'),
            'set_featured_image' => __('Set agent image', 'house-unlimited'),
            'remove_featured_image' => __('Remove agent image', 'house-unlimited'),
            'use_featured_image' => __('Use as agent image', 'house-unlimited'),
            'filter_items_list' => __('Filter agents list', 'house-unlimited'),
            'items_list_navigation' => __('Agents list navigation', 'house-unlimited'),
            'items_list' => __('Agents list', 'house-unlimited'),
        ],
        'public' => true,
        'has_archive' => 'agents',
        'rewrite' => [
            'slug' => 'agents',
            'with_front' => false,
        ],
        'menu_icon' => 'dashicons-businessperson',
        'supports' => [
            'title',
            'editor',
            'excerpt',
            'thumbnail',
            'revisions',
        ],
        'show_in_rest' => true,
    ]);
}
add_action('init', 'hu_register_post_types');

function hu_register_property_taxonomies(): void
{
    register_taxonomy('property_type', ['property'], [
        'labels' => [
            'name' => __('Property Types', 'house-unlimited'),
            'singular_name' => __('Property Type', 'house-unlimited'),
            'search_items' => __('Search Property Types', 'house-unlimited'),
            'all_items' => __('All Property Types', 'house-unlimited'),
            'edit_item' => __('Edit Property Type', 'house-unlimited'),
            'update_item' => __('Update Property Type', 'house-unlimited'),
            'add_new_item' => __('Add New Property Type', 'house-unlimited'),
            'new_item_name' => __('New Property Type Name', 'house-unlimited'),
            'menu_name' => __('Property Types', 'house-unlimited'),
        ],
        'public' => true,
        'hierarchical' => true,
        'rewrite' => [
            'slug' => 'property-type',
            'with_front' => false,
        ],
        'show_in_rest' => true,
    ]);

    register_taxonomy('property_status', ['property'], [
        'labels' => [
            'name' => __('Property Statuses', 'house-unlimited'),
            'singular_name' => __('Property Status', 'house-unlimited'),
            'search_items' => __('Search Property Statuses', 'house-unlimited'),
            'all_items' => __('All Property Statuses', 'house-unlimited'),
            'edit_item' => __('Edit Property Status', 'house-unlimited'),
            'update_item' => __('Update Property Status', 'house-unlimited'),
            'add_new_item' => __('Add New Property Status', 'house-unlimited'),
            'new_item_name' => __('New Property Status Name', 'house-unlimited'),
            'menu_name' => __('Property Statuses', 'house-unlimited'),
        ],
        'public' => true,
        'hierarchical' => true,
        'rewrite' => [
            'slug' => 'property-status',
            'with_front' => false,
        ],
        'show_in_rest' => true,
    ]);
}
add_action('init', 'hu_register_property_taxonomies');