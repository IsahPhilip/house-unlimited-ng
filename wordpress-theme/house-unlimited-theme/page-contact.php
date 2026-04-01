<?php
/**
 * Template Name: Contact Page
 * Dedicated contact page template.
 *
 * @package HouseUnlimited
 */

get_header();

if (have_posts()) :
    while (have_posts()) :
        the_post();

        $contact_info = function_exists('hu_get_contact_info') ? hu_get_contact_info() : [
            'phone' => '',
            'email' => '',
            'address' => '',
        ];

        $title = hu_get_option('contact_title', 'Get In Touch');
        $subtitle = hu_get_option('contact_subtitle', 'Ready to find your dream property? Contact us today.');

        ?>
        <section class="hu-page-intro">
            <div class="hu-container">
                <h1 class="hu-page-intro__title"><?php echo esc_html($title); ?></h1>
                <p class="hu-page-intro__subtitle"><?php echo esc_html($subtitle); ?></p>
            </div>
        </section>

        <section class="hu-section">
            <div class="hu-container">
                <div class="hu-contact-grid">
                    <article class="hu-card hu-contact-card">
                        <h2><?php esc_html_e('Contact Information', 'house-unlimited'); ?></h2>
                        <div class="hu-contact-details">
                            <div class="hu-contact-item">
                                <strong><?php esc_html_e('Phone:', 'house-unlimited'); ?></strong>
                                <a href="tel:<?php echo esc_attr($contact_info['phone']); ?>"><?php echo esc_html($contact_info['phone']); ?></a>
                            </div>
                            <div class="hu-contact-item">
                                <strong><?php esc_html_e('Email:', 'house-unlimited'); ?></strong>
                                <a href="mailto:<?php echo esc_attr($contact_info['email']); ?>"><?php echo esc_html($contact_info['email']); ?></a>
                            </div>
                            <div class="hu-contact-item">
                                <strong><?php esc_html_e('Address:', 'house-unlimited'); ?></strong>
                                <p><?php echo esc_html($contact_info['address']); ?></p>
                            </div>
                        </div>
                    </article>

                    <article class="hu-card hu-contact-form">
                        <h2><?php esc_html_e('Send Us a Message', 'house-unlimited'); ?></h2>
                        <div class="hu-contact-form-content">
                            <?php the_content(); ?>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <?php if (have_rows('office_hours', 'option')) : ?>
        <section class="hu-section hu-section--muted">
            <div class="hu-container">
                <div class="hu-card">
                    <h2><?php esc_html_e('Office Hours', 'house-unlimited'); ?></h2>
                    <div class="hu-office-hours">
                        <?php while (have_rows('office_hours', 'option')) : the_row(); ?>
                            <div class="hu-office-hours__item">
                                <span class="hu-office-hours__day"><?php echo esc_html(get_sub_field('day')); ?>:</span>
                                <span class="hu-office-hours__hours"><?php echo esc_html(get_sub_field('hours')); ?></span>
                            </div>
                        <?php endwhile; ?>
                    </div>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <?php
    endwhile;
endif;

get_footer();