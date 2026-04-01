<?php
/**
 * Single agent template.
 *
 * @package HouseUnlimited
 */

get_header();

if (have_posts()) :
    while (have_posts()) :
        the_post();

        $role = get_post_meta(get_the_ID(), 'role', true);
        $phone = get_post_meta(get_the_ID(), 'phone', true);
        $email = get_post_meta(get_the_ID(), 'email', true);
        $specialties = get_post_meta(get_the_ID(), 'specialties', true);
        $office_location = get_post_meta(get_the_ID(), 'office_location', true);
        $linkedin = get_post_meta(get_the_ID(), 'linkedin', true);
        $twitter = get_post_meta(get_the_ID(), 'twitter', true);
        $facebook = get_post_meta(get_the_ID(), 'facebook', true);

        ?>
        <section class="hu-agent-hero">
            <div class="hu-container">
                <div class="hu-agent-hero__content">
                    <div class="hu-agent-hero__image">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('large'); ?>
                        <?php else : ?>
                            <div class="hu-template-placeholder__box">
                                <p><?php esc_html_e('Agent photo coming soon.', 'house-unlimited'); ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="hu-agent-hero__info">
                        <h1 class="hu-agent-hero__title"><?php the_title(); ?></h1>
                        <?php if ($role) : ?>
                            <p class="hu-agent-hero__role"><?php echo esc_html($role); ?></p>
                        <?php endif; ?>
                        <?php if ($specialties) : ?>
                            <p class="hu-agent-hero__specialties"><?php echo esc_html($specialties); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </section>

        <section class="hu-section">
            <div class="hu-container">
                <div class="hu-agent-layout">
                    <div class="hu-agent-main">
                        <div class="hu-agent-bio">
                            <h2><?php esc_html_e('About', 'house-unlimited'); ?></h2>
                            <div class="entry-content">
                                <?php the_content(); ?>
                            </div>
                        </div>

                        <?php
                        // Agent's properties
                        $properties_query = new WP_Query([
                            'post_type' => 'property',
                            'posts_per_page' => 6,
                            'meta_query' => [
                                [
                                    'key' => 'agent_id',
                                    'value' => get_the_ID(),
                                    'compare' => '='
                                ]
                            ]
                        ]);

                        if ($properties_query->have_posts()) :
                            ?>
                            <div class="hu-agent-properties">
                                <h3><?php esc_html_e('Listed Properties', 'house-unlimited'); ?></h3>
                                <div class="hu-property-grid">
                                    <?php
                                    while ($properties_query->have_posts()) :
                                        $properties_query->the_post();
                                        $property_price = get_post_meta(get_the_ID(), 'price', true);
                                        $property_address = get_post_meta(get_the_ID(), 'address', true);
                                        ?>
                                        <article class="hu-card hu-property-card">
                                            <a class="hu-property-card__image" href="<?php the_permalink(); ?>">
                                                <?php if (has_post_thumbnail()) : ?>
                                                    <?php the_post_thumbnail('large'); ?>
                                                <?php endif; ?>
                                            </a>
                                            <div class="hu-property-card__content">
                                                <?php if ($property_price) : ?>
                                                    <p class="hu-property-card__price"><?php echo esc_html($property_price); ?></p>
                                                <?php endif; ?>
                                                <h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
                                                <?php if ($property_address) : ?>
                                                    <p><?php echo esc_html($property_address); ?></p>
                                                <?php endif; ?>
                                            </div>
                                        </article>
                                    <?php endwhile;
                                    wp_reset_postdata();
                                    ?>
                                </div>
                                <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="hu-button">
                                    <?php esc_html_e('View All Properties', 'house-unlimited'); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                    </div>

                    <aside class="hu-agent-sidebar">
                        <div class="hu-agent-contact">
                            <h3><?php esc_html_e('Contact Information', 'house-unlimited'); ?></h3>
                            <div class="hu-agent-contact-details">
                                <?php if ($phone) : ?>
                                    <div class="hu-contact-item">
                                        <strong><?php esc_html_e('Phone', 'house-unlimited'); ?>:</strong>
                                        <a href="tel:<?php echo esc_attr($phone); ?>"><?php echo esc_html($phone); ?></a>
                                    </div>
                                <?php endif; ?>

                                <?php if ($email) : ?>
                                    <div class="hu-contact-item">
                                        <strong><?php esc_html_e('Email', 'house-unlimited'); ?>:</strong>
                                        <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
                                    </div>
                                <?php endif; ?>

                                <?php if ($office_location) : ?>
                                    <div class="hu-contact-item">
                                        <strong><?php esc_html_e('Office', 'house-unlimited'); ?>:</strong>
                                        <p><?php echo esc_html($office_location); ?></p>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <?php if ($linkedin || $twitter || $facebook) : ?>
                            <div class="hu-agent-social">
                                <h3><?php esc_html_e('Connect', 'house-unlimited'); ?></h3>
                                <div class="hu-social-links">
                                    <?php if ($linkedin) : ?>
                                        <a href="<?php echo esc_url($linkedin); ?>" target="_blank" class="hu-social-link">
                                            <span class="hu-icon-linkedin"></span>
                                            LinkedIn
                                        </a>
                                    <?php endif; ?>
                                    <?php if ($twitter) : ?>
                                        <a href="<?php echo esc_url($twitter); ?>" target="_blank" class="hu-social-link">
                                            <span class="hu-icon-twitter"></span>
                                            Twitter
                                        </a>
                                    <?php endif; ?>
                                    <?php if ($facebook) : ?>
                                        <a href="<?php echo esc_url($facebook); ?>" target="_blank" class="hu-social-link">
                                            <span class="hu-icon-facebook"></span>
                                            Facebook
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endif; ?>

                        <div class="hu-agent-cta">
                            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="hu-button hu-button--primary">
                                <?php esc_html_e('Contact Agent', 'house-unlimited'); ?>
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <?php
    endwhile;
else :
    ?>
    <section class="hu-template-placeholder">
        <div class="hu-container">
            <div class="hu-card hu-template-placeholder__box">
                <h1><?php esc_html_e('Agent Not Found', 'house-unlimited'); ?></h1>
                <p><?php esc_html_e('The agent profile you are looking for could not be found.', 'house-unlimited'); ?></p>
            </div>
        </div>
    </section>
    <?php
endif;

get_footer();