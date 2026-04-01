<?php
/**
 * Agent archive template.
 *
 * @package HouseUnlimited
 */

get_header();

hu_page_intro(
    post_type_archive_title('', false),
    esc_html__('Meet our team of experienced real estate professionals.', 'house-unlimited')
);
?>
<section class="hu-section">
    <div class="hu-container">
        <?php if (have_posts()) : ?>
            <div class="hu-agent-grid">
                <?php
                while (have_posts()) :
                    the_post();

                    $role = get_post_meta(get_the_ID(), 'role', true);
                    $phone = get_post_meta(get_the_ID(), 'phone', true);
                    $email = get_post_meta(get_the_ID(), 'email', true);
                    $specialties = get_post_meta(get_the_ID(), 'specialties', true);
                    ?>
                    <article <?php post_class('hu-card hu-agent-card'); ?>>
                        <div class="hu-agent-card__image">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('medium'); ?>
                            <?php else : ?>
                                <div class="hu-template-placeholder__box">
                                    <p><?php esc_html_e('Agent photo coming soon.', 'house-unlimited'); ?></p>
                                </div>
                            <?php endif; ?>
                        </div>

                        <div class="hu-agent-card__content">
                            <h3 class="hu-agent-card__title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>

                            <?php if ($role) : ?>
                                <p class="hu-agent-card__role"><?php echo esc_html($role); ?></p>
                            <?php endif; ?>

                            <div class="hu-agent-card__contact">
                                <?php if ($phone) : ?>
                                    <a href="tel:<?php echo esc_attr($phone); ?>" class="hu-agent-contact-item">
                                        <span class="hu-icon-phone"></span>
                                        <?php echo esc_html($phone); ?>
                                    </a>
                                <?php endif; ?>

                                <?php if ($email) : ?>
                                    <a href="mailto:<?php echo esc_attr($email); ?>" class="hu-agent-contact-item">
                                        <span class="hu-icon-email"></span>
                                        <?php echo esc_html($email); ?>
                                    </a>
                                <?php endif; ?>
                            </div>

                            <?php if ($specialties) : ?>
                                <div class="hu-agent-card__specialties">
                                    <h4><?php esc_html_e('Specialties', 'house-unlimited'); ?></h4>
                                    <p><?php echo esc_html($specialties); ?></p>
                                </div>
                            <?php endif; ?>

                            <p class="hu-agent-card__excerpt"><?php echo esc_html(get_the_excerpt()); ?></p>

                            <a href="<?php the_permalink(); ?>" class="hu-button hu-button--secondary">
                                <?php esc_html_e('View Profile', 'house-unlimited'); ?>
                            </a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php hu_pagination(); ?>

        <?php else : ?>
            <div class="hu-card hu-template-placeholder__box">
                <h2><?php esc_html_e('No Agents Found', 'house-unlimited'); ?></h2>
                <p><?php esc_html_e('Agent profiles will appear here once they are added in WordPress.', 'house-unlimited'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php
get_footer();