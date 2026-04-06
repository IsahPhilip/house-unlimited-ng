<?php
/**
 * Theme helper functions for templates.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

function hu_posted_on(): void
{
    echo '<time datetime="' . esc_attr(get_the_date(DATE_W3C)) . '">' . esc_html(get_the_date()) . '</time>';
}

function hu_read_more_link(string $label = 'Read More'): string
{
    return sprintf(
        '<a class="hu-button" href="%s">%s</a>',
        esc_url(get_permalink()),
        esc_html__($label, 'house-unlimited')
    );
}

function hu_page_intro(string $title, string $subtitle = ''): void
{
    ?>
    <section class="hu-page-hero">
        <div class="hu-container">
            <h1 class="hu-page-title"><?php echo esc_html($title); ?></h1>
            <?php if ($subtitle) : ?>
                <p class="hu-page-subtitle"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>
    </section>
    <?php
}

function hu_pagination(): void
{
    global $wp_query;

    if ($wp_query->max_num_pages <= 1) {
        return;
    }

    $paged = get_query_var('paged') ? absint(get_query_var('paged')) : 1;
    $max   = intval($wp_query->max_num_pages);

    // Add current page to paginated links for correct active state
    $links = paginate_links([
        'base'      => str_replace(999999999, '%#%', esc_url(get_pagenum_link(999999999))),
        'format'    => '?paged=%#%',
        'current'   => $paged,
        'total'     => $max,
        'type'      => 'array',
        'prev_text' => __('« Previous', 'house-unlimited'),
        'next_text' => __('Next »', 'house-unlimited'),
    ]);

    if (is_array($links)) {
        echo '<nav class="hu-pagination" aria-label="' . esc_attr__('Posts navigation', 'house-unlimited') . '">';
        echo '<ul class="hu-pagination__list">';
        foreach ($links as $link) {
            echo '<li class="hu-pagination__item">' . $link . '</li>';
        }
        echo '</ul>';
        echo '</nav>';
    }
}

function hu_get_profile_table_name(): string
{
    global $wpdb;
    return $wpdb->prefix . 'hu_user_profiles';
}

function hu_profile_table_exists(): bool
{
    global $wpdb;
    $table = hu_get_profile_table_name();
    return $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table;
}

function hu_get_user_profile_data(int $user_id): array
{
    global $wpdb;

    $defaults = [
        'phone' => '',
        'bio' => '',
        'location' => '',
        'avatar_url' => '',
        'preferences' => [
            'email' => true,
            'sms' => false,
        ],
    ];

    if ($user_id <= 0) {
        return $defaults;
    }

    if (hu_profile_table_exists()) {
        $table = hu_get_profile_table_name();
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE user_id = %d", $user_id), ARRAY_A);
        if ($row) {
            $prefs = [];
            if (!empty($row['preferences'])) {
                $decoded = json_decode($row['preferences'], true);
                if (is_array($decoded)) {
                    $prefs = $decoded;
                }
            }
            return [
                'phone' => $row['phone'] ?? '',
                'bio' => $row['bio'] ?? '',
                'location' => $row['location'] ?? '',
                'avatar_url' => $row['avatar_url'] ?? '',
                'preferences' => array_merge($defaults['preferences'], $prefs),
            ];
        }
    }

    $prefs_raw = get_user_meta($user_id, 'hu_preferences', true);
    $prefs = is_array($prefs_raw) ? $prefs_raw : [];

    return [
        'phone' => get_user_meta($user_id, 'hu_phone', true) ?: '',
        'bio' => get_user_meta($user_id, 'hu_bio', true) ?: '',
        'location' => get_user_meta($user_id, 'hu_location', true) ?: '',
        'avatar_url' => get_user_meta($user_id, 'hu_avatar_url', true) ?: '',
        'preferences' => array_merge($defaults['preferences'], $prefs),
    ];
}

function hu_update_user_profile_data(int $user_id, array $data): void
{
    global $wpdb;

    if ($user_id <= 0) {
        return;
    }

    $payload = [
        'phone' => sanitize_text_field($data['phone'] ?? ''),
        'bio' => sanitize_textarea_field($data['bio'] ?? ''),
        'location' => sanitize_text_field($data['location'] ?? ''),
        'avatar_url' => esc_url_raw($data['avatar_url'] ?? ''),
        'preferences' => wp_json_encode($data['preferences'] ?? []),
    ];

    if (hu_profile_table_exists()) {
        $table = hu_get_profile_table_name();
        $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$table} WHERE user_id = %d", $user_id));
        if ($exists) {
            $wpdb->update($table, $payload, ['user_id' => $user_id]);
        } else {
            $payload['user_id'] = $user_id;
            $wpdb->insert($table, $payload);
        }
        return;
    }

    update_user_meta($user_id, 'hu_phone', $payload['phone']);
    update_user_meta($user_id, 'hu_bio', $payload['bio']);
    update_user_meta($user_id, 'hu_location', $payload['location']);
    update_user_meta($user_id, 'hu_avatar_url', $payload['avatar_url']);
    update_user_meta($user_id, 'hu_preferences', json_decode($payload['preferences'], true));
}

function hu_get_user_activity_counts(int $user_id): array
{
    global $wpdb;

    $defaults = [
        'wishlist' => 0,
        'reviews' => 0,
    ];

    if ($user_id <= 0) {
        return $defaults;
    }

    $wishlist_table = $wpdb->prefix . 'hu_wishlist';
    $reviews_table = $wpdb->prefix . 'hu_reviews';

    $wishlist_exists = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wishlist_table)) === $wishlist_table;
    $reviews_exists = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $reviews_table)) === $reviews_table;

    if ($wishlist_exists) {
        $defaults['wishlist'] = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wishlist_table} WHERE user_id = %d", $user_id));
    }

    if ($reviews_exists) {
        $defaults['reviews'] = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$reviews_table} WHERE user_id = %d", $user_id));
    }

    return $defaults;
}
