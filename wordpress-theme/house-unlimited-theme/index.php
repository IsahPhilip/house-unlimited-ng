<?php
/**
 * Main index template.
 *
 * @package HouseUnlimited
 */

get_header();

if (have_posts()) :
    while (have_posts()) :
        the_post();

        if (is_home() || is_archive()) {
            ?>
            <section class="hu-section">
                <div class="hu-container">
                    <article class="hu-card hu-post-card">
                        <div class="hu-post-card__meta"><?php hu_posted_on(); ?></div>
                        <h2 class="hu-post-card__title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                        <p class="hu-post-card__excerpt"><?php echo esc_html(get_the_excerpt()); ?></p>
                        <?php echo hu_read_more_link(); ?>
                    </article>
                </div>
            </section>
            <?php
        } else {
            ?>
            <section class="hu-section">
                <div class="hu-container">
                    <article <?php post_class('hu-card hu-placeholder-card'); ?>>
                        <h1><?php the_title(); ?></h1>
                        <div>
                            <?php the_content(); ?>
                        </div>
                    </article>
                </div>
            </section>
            <?php
        }
    endwhile;
else :
    ?>
    <section class="hu-template-placeholder">
        <div class="hu-container">
            <div class="hu-card hu-template-placeholder__box">
                <h1><?php esc_html_e('Nothing Found', 'house-unlimited'); ?></h1>
                <p><?php esc_html_e('Content will appear here once pages or posts are added in WordPress.', 'house-unlimited'); ?></p>
            </div>
        </div>
    </section>
    <?php
endif;

get_footer();
