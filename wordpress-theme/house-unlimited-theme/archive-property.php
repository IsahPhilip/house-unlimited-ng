<?php
/**
 * Property archive template.
 *
 * @package HouseUnlimited
 */

get_header();

// Get filter parameters
$location = isset($_GET['location']) ? sanitize_text_field($_GET['location']) : '';
$property_type = isset($_GET['property_type']) ? sanitize_text_field($_GET['property_type']) : '';
$property_status = isset($_GET['property_status']) ? sanitize_text_field($_GET['property_status']) : '';
$price_min = isset($_GET['price_min']) ? intval($_GET['price_min']) : '';
$price_max = isset($_GET['price_max']) ? intval($_GET['price_max']) : '';

hu_page_intro(
    post_type_archive_title('', false),
    esc_html__('Browse our latest property listings and find a place that feels like home.', 'house-unlimited')
);
?>

<section class="hu-section hu-property-filters">
    <div class="hu-container">
        <form class="hu-property-search" method="get" action="<?php echo esc_url(get_post_type_archive_link('property')); ?>">
            <div class="hu-property-search__field">
                <label for="hu-location"><?php esc_html_e('Location', 'house-unlimited'); ?></label>
                <input id="hu-location" type="text" name="location" value="<?php echo esc_attr($location); ?>" placeholder="e.g. Maitama 2, Abuja">
            </div>
            <div class="hu-property-search__field">
                <label for="hu-type"><?php esc_html_e('Type', 'house-unlimited'); ?></label>
                <select id="hu-type" name="property_type">
                    <option value=""><?php esc_html_e('Any', 'house-unlimited'); ?></option>
                    <?php
                    $types = get_terms(['taxonomy' => 'property_type', 'hide_empty' => false]);
                    foreach ($types as $type) {
                        echo '<option value="' . esc_attr($type->slug) . '" ' . selected($property_type, $type->slug, false) . '>' . esc_html($type->name) . '</option>';
                    }
                    ?>
                </select>
            </div>
            <div class="hu-property-search__field">
                <label for="hu-status"><?php esc_html_e('Status', 'house-unlimited'); ?></label>
                <select id="hu-status" name="property_status">
                    <option value=""><?php esc_html_e('Any', 'house-unlimited'); ?></option>
                    <?php
                    $statuses = get_terms(['taxonomy' => 'property_status', 'hide_empty' => false]);
                    foreach ($statuses as $status) {
                        echo '<option value="' . esc_attr($status->slug) . '" ' . selected($property_status, $status->slug, false) . '>' . esc_html($status->name) . '</option>';
                    }
                    ?>
                </select>
            </div>
            <div class="hu-property-search__field">
                <label for="hu-price-min"><?php esc_html_e('Min Price', 'house-unlimited'); ?></label>
                <input id="hu-price-min" type="number" name="price_min" value="<?php echo esc_attr($price_min); ?>" placeholder="Min price">
            </div>
            <div class="hu-property-search__field">
                <label for="hu-price-max"><?php esc_html_e('Max Price', 'house-unlimited'); ?></label>
                <input id="hu-price-max" type="number" name="price_max" value="<?php echo esc_attr($price_max); ?>" placeholder="Max price">
            </div>
            <div class="hu-property-search__field">
                <label>&nbsp;</label>
                <button class="hu-button" type="submit"><?php esc_html_e('Search', 'house-unlimited'); ?></button>
            </div>
        </form>
    </div>
</section>

<section class="hu-section">
    <div class="hu-container">
        <?php if (have_posts()) : ?>
            <div class="hu-property-results">
                <p class="hu-property-results__count">
                    <?php
                    global $wp_query;
                    printf(
                        esc_html(_n('%d property found', '%d properties found', $wp_query->found_posts, 'house-unlimited')),
                        number_format_i18n($wp_query->found_posts)
                    );
                    ?>
                </p>
            </div>

            <div class="hu-property-grid">
                <?php
                while (have_posts()) :
                    the_post();

                    $price   = get_post_meta(get_the_ID(), 'price', true);
                    $address = get_post_meta(get_the_ID(), 'address', true);
                    $beds    = get_post_meta(get_the_ID(), 'beds', true);
                    $baths   = get_post_meta(get_the_ID(), 'baths', true);
                    $sqft    = get_post_meta(get_the_ID(), 'sqft', true);
                    ?>
                    <article <?php post_class('hu-card hu-property-card'); ?>>
                        <a class="hu-property-card__image" href="<?php the_permalink(); ?>">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('large'); ?>
                            <?php else : ?>
                                <div class="hu-template-placeholder__box">
                                    <p><?php esc_html_e('Property image coming soon.', 'house-unlimited'); ?></p>
                                </div>
                            <?php endif; ?>
                        </a>

                        <div class="hu-property-card__content">
                            <?php if ($price) : ?>
                                <p class="hu-property-card__price"><?php echo esc_html($price); ?></p>
                            <?php endif; ?>

                            <h3 class="hu-property-card__title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>

                            <?php if ($address) : ?>
                                <p class="hu-property-card__address"><?php echo esc_html($address); ?></p>
                            <?php endif; ?>

                            <div class="hu-property-card__specs">
                                <?php if ($beds) : ?>
                                    <span class="hu-spec"><?php echo esc_html($beds); ?> <?php esc_html_e('beds', 'house-unlimited'); ?></span>
                                <?php endif; ?>
                                <?php if ($baths) : ?>
                                    <span class="hu-spec"><?php echo esc_html($baths); ?> <?php esc_html_e('baths', 'house-unlimited'); ?></span>
                                <?php endif; ?>
                                <?php if ($sqft) : ?>
                                    <span class="hu-spec"><?php echo esc_html($sqft); ?> <?php esc_html_e('sqft', 'house-unlimited'); ?></span>
                                <?php endif; ?>
                            </div>

                            <p class="hu-property-card__excerpt"><?php echo esc_html(get_the_excerpt()); ?></p>

                            <?php echo hu_read_more_link(esc_html__('View Property', 'house-unlimited')); ?>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php hu_pagination(); ?>

        <?php else : ?>
            <div class="hu-card hu-template-placeholder__box">
                <h2><?php esc_html_e('No Properties Found', 'house-unlimited'); ?></h2>
                <p><?php esc_html_e('Try adjusting your search filters or check back later for new listings.', 'house-unlimited'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php
get_footer();