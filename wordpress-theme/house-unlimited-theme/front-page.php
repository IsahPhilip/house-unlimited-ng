<?php
/**
 * Front page template.
 *
 * @package HouseUnlimited
 */

get_header();
?>

<section class="hu-home-hero">
    <div class="hu-container">
        <div class="hu-home-hero__content">
            <p class="hu-home-hero__eyebrow"><?php hu_the_option('hero_badge', 'Find Your Dream Property Easily'); ?></p>
            <h1 class="hu-home-hero__title">
                <?php hu_the_option('hero_title', 'Instant Property Deals: Buy and Sell'); ?>
            </h1>
            <p class="hu-home-hero__text">
                <?php hu_the_option('hero_text', 'Experience the next generation of real estate discovery with verified listings, curated guidance, and a premium property experience.'); ?>
            </p>

            <form class="hu-home-search" method="get" action="<?php echo esc_url(home_url('/property')); ?>">
                <div class="hu-home-search__field">
                    <label for="hu-location"><?php esc_html_e('Location', 'house-unlimited'); ?></label>
                    <input id="hu-location" type="text" name="location" placeholder="e.g. Maitama 2, Abuja">
                </div>
                <div class="hu-home-search__field">
                    <label for="hu-type"><?php esc_html_e('Type', 'house-unlimited'); ?></label>
                    <select id="hu-type" name="property_type">
                        <option value=""><?php esc_html_e('Any', 'house-unlimited'); ?></option>
                        <option value="house"><?php esc_html_e('House', 'house-unlimited'); ?></option>
                        <option value="land"><?php esc_html_e('Land', 'house-unlimited'); ?></option>
                    </select>
                </div>
                <div class="hu-home-search__field">
                    <label for="hu-status"><?php esc_html_e('Status', 'house-unlimited'); ?></label>
                    <select id="hu-status" name="property_status">
                        <option value=""><?php esc_html_e('Any', 'house-unlimited'); ?></option>
                        <option value="sale"><?php esc_html_e('For Sale', 'house-unlimited'); ?></option>
                        <option value="rent"><?php esc_html_e('For Rent', 'house-unlimited'); ?></option>
                    </select>
                </div>
                <div class="hu-home-search__field">
                    <label>&nbsp;</label>
                    <button class="hu-button" type="submit"><?php esc_html_e('Search', 'house-unlimited'); ?></button>
                </div>
            </form>
        </div>
    </div>
</section>

<?php if (have_rows('services', 'option')) : ?>
<section class="hu-section hu-services">
    <div class="hu-container">
        <h2><?php hu_the_option('services_title', 'Our Services'); ?></h2>
        <div class="hu-services-grid">
            <?php while (have_rows('services', 'option')) : the_row(); ?>
                <div class="hu-service-card">
                    <div class="hu-service-card__icon">
                        <?php echo esc_html(get_sub_field('icon')); ?>
                    </div>
                    <h3><?php echo esc_html(get_sub_field('title')); ?></h3>
                    <p><?php echo esc_html(get_sub_field('description')); ?></p>
                </div>
            <?php endwhile; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<section class="hu-section">
    <div class="hu-container">
        <h2><?php esc_html_e('Featured Properties', 'house-unlimited'); ?></h2>
        <div class="hu-feature-grid">
            <?php
            $featured_query = new WP_Query([
                'post_type' => 'property',
                'posts_per_page' => 3,
                'meta_query' => [
                    [
                        'key' => 'featured',
                        'value' => '1',
                        'compare' => '='
                    ]
                ]
            ]);

            if ($featured_query->have_posts()) :
                while ($featured_query->have_posts()) :
                    $featured_query->the_post();
                    ?>
                    <article class="hu-card hu-property-card">
                        <div class="hu-property-card__image">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('large'); ?>
                            <?php endif; ?>
                        </div>
                        <div class="hu-property-card__content">
                            <h3><?php the_title(); ?></h3>
                            <p class="hu-property-card__meta"><?php echo esc_html(get_post_meta(get_the_ID(), 'price', true)); ?></p>
                            <p><?php echo esc_html(wp_trim_words(get_the_excerpt() ?: get_the_content(), 18)); ?></p>
                            <?php echo hu_read_more_link('View Property'); ?>
                        </div>
                    </article>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                ?>
                <div class="hu-card hu-placeholder-card">
                    <h3><?php esc_html_e('Property content will appear here', 'house-unlimited'); ?></h3>
                    <p><?php esc_html_e('Once the property custom post type is registered and listings are added, featured properties will render in this section.', 'house-unlimited'); ?></p>
                </div>
                <?php
            endif;
            ?>
        </div>
    </div>
</section>

<?php if (have_rows('testimonials', 'option')) : ?>
<section class="hu-section hu-section--muted hu-testimonials">
    <div class="hu-container">
        <h2><?php hu_the_option('testimonials_title', 'What Our Clients Say'); ?></h2>
        <div class="hu-testimonials-grid">
            <?php while (have_rows('testimonials', 'option')) : the_row(); ?>
                <div class="hu-testimonial-card">
                    <blockquote><?php echo esc_html(get_sub_field('quote')); ?></blockquote>
                    <cite><?php echo esc_html(get_sub_field('author')); ?>, <?php echo esc_html(get_sub_field('role')); ?></cite>
                </div>
            <?php endwhile; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<section class="hu-section hu-section--muted">
    <div class="hu-container">
        <h2><?php esc_html_e('Latest Insights', 'house-unlimited'); ?></h2>
        <div class="hu-post-grid">
            <?php
            $blog_query = new WP_Query([
                'post_type' => 'post',
                'posts_per_page' => 3,
            ]);

            if ($blog_query->have_posts()) :
                while ($blog_query->have_posts()) :
                    $blog_query->the_post();
                    ?>
                    <article class="hu-card hu-post-card">
                        <div class="hu-post-card__meta"><?php hu_posted_on(); ?></div>
                        <h3 class="hu-post-card__title"><?php the_title(); ?></h3>
                        <p class="hu-post-card__excerpt"><?php echo esc_html(get_the_excerpt()); ?></p>
                        <?php echo hu_read_more_link(); ?>
                    </article>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                ?>
                <div class="hu-card hu-placeholder-card">
                    <h3><?php esc_html_e('Blog posts will appear here', 'house-unlimited'); ?></h3>
                    <p><?php esc_html_e('Use WordPress posts for your blog content and this area will automatically populate.', 'house-unlimited'); ?></p>
                </div>
                <?php
            endif;
            ?>
        </div>
    </div>
</section>

<?php
get_footer();
?>
