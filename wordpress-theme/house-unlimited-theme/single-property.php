<?php
/**
 * Single property template.
 *
 * @package HouseUnlimited
 */

get_header();

if (have_posts()) :
    while (have_posts()) :
        the_post();

        $price   = get_post_meta(get_the_ID(), 'price', true);
        $address = get_post_meta(get_the_ID(), 'address', true);
        $beds    = get_post_meta(get_the_ID(), 'beds', true);
        $baths   = get_post_meta(get_the_ID(), 'baths', true);
        $sqft    = get_post_meta(get_the_ID(), 'sqft', true);
        $year_built = get_post_meta(get_the_ID(), 'year_built', true);
        $lot_size = get_post_meta(get_the_ID(), 'lot_size', true);
        $parking = get_post_meta(get_the_ID(), 'parking', true);
        $gallery = get_post_meta(get_the_ID(), 'gallery', true);
        $virtual_tour = get_post_meta(get_the_ID(), 'virtual_tour', true);
        $video_tour = get_post_meta(get_the_ID(), 'video_tour', true);
        $amenities = get_post_meta(get_the_ID(), 'amenities', true);
        $agent_id = get_post_meta(get_the_ID(), 'agent_id', true);

        ?>
        <section class="hu-property-hero">
            <div class="hu-container">
                <div class="hu-property-hero__content">
                    <h1 class="hu-property-hero__title"><?php the_title(); ?></h1>
                    <?php if ($address) : ?>
                        <p class="hu-property-hero__address"><?php echo esc_html($address); ?></p>
                    <?php endif; ?>
                    <?php if ($price) : ?>
                        <p class="hu-property-hero__price"><?php echo esc_html($price); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <section class="hu-section">
            <div class="hu-container">
                <div class="hu-property-layout">
                    <div class="hu-property-main">
                        <?php if ($gallery || has_post_thumbnail()) : ?>
                            <div class="hu-property-gallery">
                                <?php if ($gallery) : ?>
                                    <!-- Gallery implementation would go here -->
                                    <div class="hu-gallery-placeholder">
                                        <p><?php esc_html_e('Property gallery will be displayed here.', 'house-unlimited'); ?></p>
                                    </div>
                                <?php elseif (has_post_thumbnail()) : ?>
                                    <?php the_post_thumbnail('large'); ?>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>

                        <div class="hu-property-content">
                            <h2><?php esc_html_e('About This Property', 'house-unlimited'); ?></h2>
                            <div class="entry-content">
                                <?php the_content(); ?>
                            </div>
                        </div>

                        <?php if ($amenities) : ?>
                            <div class="hu-property-amenities">
                                <h3><?php esc_html_e('Amenities', 'house-unlimited'); ?></h3>
                                <ul>
                                    <?php foreach ((array) $amenities as $amenity) : ?>
                                        <li><?php echo esc_html($amenity); ?></li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        <?php endif; ?>

                        <?php if ($virtual_tour || $video_tour) : ?>
                            <div class="hu-property-tours">
                                <h3><?php esc_html_e('Virtual Tours', 'house-unlimited'); ?></h3>
                                <?php if ($virtual_tour) : ?>
                                    <div class="hu-virtual-tour">
                                        <iframe src="<?php echo esc_url($virtual_tour); ?>" width="100%" height="400" frameborder="0"></iframe>
                                    </div>
                                <?php endif; ?>
                                <?php if ($video_tour) : ?>
                                    <div class="hu-video-tour">
                                        <video controls width="100%">
                                            <source src="<?php echo esc_url($video_tour); ?>" type="video/mp4">
                                        </video>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <aside class="hu-property-sidebar">
                        <div class="hu-property-details">
                            <h3><?php esc_html_e('Property Details', 'house-unlimited'); ?></h3>
                            <dl class="hu-property-specs">
                                <?php if ($beds) : ?>
                                    <div class="hu-spec-item">
                                        <dt><?php esc_html_e('Bedrooms', 'house-unlimited'); ?></dt>
                                        <dd><?php echo esc_html($beds); ?></dd>
                                    </div>
                                <?php endif; ?>
                                <?php if ($baths) : ?>
                                    <div class="hu-spec-item">
                                        <dt><?php esc_html_e('Bathrooms', 'house-unlimited'); ?></dt>
                                        <dd><?php echo esc_html($baths); ?></dd>
                                    </div>
                                <?php endif; ?>
                                <?php if ($sqft) : ?>
                                    <div class="hu-spec-item">
                                        <dt><?php esc_html_e('Square Feet', 'house-unlimited'); ?></dt>
                                        <dd><?php echo esc_html($sqft); ?></dd>
                                    </div>
                                <?php endif; ?>
                                <?php if ($year_built) : ?>
                                    <div class="hu-spec-item">
                                        <dt><?php esc_html_e('Year Built', 'house-unlimited'); ?></dt>
                                        <dd><?php echo esc_html($year_built); ?></dd>
                                    </div>
                                <?php endif; ?>
                                <?php if ($lot_size) : ?>
                                    <div class="hu-spec-item">
                                        <dt><?php esc_html_e('Lot Size', 'house-unlimited'); ?></dt>
                                        <dd><?php echo esc_html($lot_size); ?></dd>
                                    </div>
                                <?php endif; ?>
                                <?php if ($parking) : ?>
                                    <div class="hu-spec-item">
                                        <dt><?php esc_html_e('Parking', 'house-unlimited'); ?></dt>
                                        <dd><?php echo esc_html($parking); ?></dd>
                                    </div>
                                <?php endif; ?>
                            </dl>
                        </div>

                        <?php if ($agent_id) : ?>
                            <div class="hu-property-agent">
                                <h3><?php esc_html_e('Listed By', 'house-unlimited'); ?></h3>
                                <?php
                                $agent = get_post($agent_id);
                                if ($agent) :
                                    ?>
                                    <div class="hu-agent-card">
                                        <?php if (has_post_thumbnail($agent)) : ?>
                                            <div class="hu-agent-avatar">
                                                <?php echo get_the_post_thumbnail($agent, 'thumbnail'); ?>
                                            </div>
                                        <?php endif; ?>
                                        <div class="hu-agent-info">
                                            <h4><?php echo esc_html(get_the_title($agent)); ?></h4>
                                            <p><?php echo esc_html(get_post_meta($agent_id, 'role', true)); ?></p>
                                            <a href="tel:<?php echo esc_attr(get_post_meta($agent_id, 'phone', true)); ?>">
                                                <?php echo esc_html(get_post_meta($agent_id, 'phone', true)); ?>
                                            </a>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>

                        <div class="hu-property-actions">
                            <button class="hu-button hu-button--primary"><?php esc_html_e('Contact Agent', 'house-unlimited'); ?></button>
                            <button class="hu-button hu-button--secondary"><?php esc_html_e('Share Property', 'house-unlimited'); ?></button>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <?php
        // Similar properties
        $similar_query = new WP_Query([
            'post_type' => 'property',
            'posts_per_page' => 3,
            'post__not_in' => [get_the_ID()],
            'tax_query' => [
                [
                    'taxonomy' => 'property_type',
                    'field'    => 'id',
                    'terms'    => wp_get_post_terms(get_the_ID(), 'property_type', ['fields' => 'ids']),
                ]
            ]
        ]);

        if ($similar_query->have_posts()) :
            ?>
            <section class="hu-section hu-section--muted">
                <div class="hu-container">
                    <h2><?php esc_html_e('Similar Properties', 'house-unlimited'); ?></h2>
                    <div class="hu-property-grid">
                        <?php
                        while ($similar_query->have_posts()) :
                            $similar_query->the_post();
                            $similar_price = get_post_meta(get_the_ID(), 'price', true);
                            $similar_address = get_post_meta(get_the_ID(), 'address', true);
                            ?>
                            <article class="hu-card hu-property-card">
                                <a class="hu-property-card__image" href="<?php the_permalink(); ?>">
                                    <?php if (has_post_thumbnail()) : ?>
                                        <?php the_post_thumbnail('large'); ?>
                                    <?php endif; ?>
                                </a>
                                <div class="hu-property-card__content">
                                    <?php if ($similar_price) : ?>
                                        <p class="hu-property-card__price"><?php echo esc_html($similar_price); ?></p>
                                    <?php endif; ?>
                                    <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                                    <?php if ($similar_address) : ?>
                                        <p><?php echo esc_html($similar_address); ?></p>
                                    <?php endif; ?>
                                </div>
                            </article>
                        <?php endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <?php
    endwhile;
else :
    ?>
    <section class="hu-template-placeholder">
        <div class="hu-container">
            <div class="hu-card hu-template-placeholder__box">
                <h1><?php esc_html_e('Property Not Found', 'house-unlimited'); ?></h1>
                <p><?php esc_html_e('The property you are looking for could not be found.', 'house-unlimited'); ?></p>
            </div>
        </div>
    </section>
    <?php
endif;

get_footer();