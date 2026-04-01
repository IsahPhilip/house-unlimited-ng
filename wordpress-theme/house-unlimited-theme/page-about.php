<?php
/**
 * Template Name: About Page
 * Dedicated about page template.
 *
 * @package HouseUnlimited
 */

get_header();

if (have_posts()) :
    while (have_posts()) :
        the_post();

        $badge = hu_get_option('about_badge', 'About House Unlimited');
        $title = hu_get_option('about_title', 'Your Trusted Real Estate Partner');
        $content = hu_get_option('about_content');
        $image = hu_get_option('about_image');

        ?>
        <section class="hu-page-intro">
            <div class="hu-container">
                <p class="hu-page-intro__badge"><?php echo esc_html($badge); ?></p>
                <h1 class="hu-page-intro__title"><?php echo esc_html($title); ?></h1>
                <?php if ($content) : ?>
                    <div class="hu-page-intro__content">
                        <?php echo wp_kses_post($content); ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>

        <?php if ($image) : ?>
        <section class="hu-section">
            <div class="hu-container">
                <div class="hu-about-image">
                    <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>">
                </div>
            </div>
        </section>
        <?php endif; ?>

        <?php if (have_rows('about_stats', 'option')) : ?>
        <section class="hu-section hu-section--muted">
            <div class="hu-container">
                <h2><?php esc_html_e('At a Glance', 'house-unlimited'); ?></h2>
                <div class="hu-stats-grid">
                    <?php while (have_rows('about_stats', 'option')) : the_row(); ?>
                        <article class="hu-card hu-stat-card">
                            <h3><?php echo esc_html(get_sub_field('number')); ?></h3>
                            <p><?php echo esc_html(get_sub_field('label')); ?></p>
                        </article>
                    <?php endwhile; ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <?php
    endwhile;
endif;

get_footer();