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
