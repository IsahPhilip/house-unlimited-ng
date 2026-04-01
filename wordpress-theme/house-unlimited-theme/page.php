<?php
/**
 * Generic page template.
 *
 * @package HouseUnlimited
 */

get_header();

if (have_posts()) :
    while (have_posts()) :
        the_post();

        hu_page_intro(get_the_title(), get_the_excerpt());

        ?>
        <section class="hu-section">
            <div class="hu-container">
                <article <?php post_class('hu-card hu-template-placeholder__box'); ?>>
                    <?php the_content(); ?>
                </article>
            </div>
        </section>
        <?php
    endwhile;
endif;

get_footer();
