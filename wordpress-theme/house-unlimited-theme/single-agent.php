<?php
/**
 * Agent single template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

while (have_posts()) :
    the_post();
    $post_id = get_the_ID();
    $role = get_post_meta($post_id, 'role', true);
    $phone = get_post_meta($post_id, 'phone', true);
    $email = get_post_meta($post_id, 'email', true);
    $linkedin = get_post_meta($post_id, 'linkedin', true);
    $twitter = get_post_meta($post_id, 'twitter', true);
    $facebook = get_post_meta($post_id, 'facebook', true);
    $image_url = get_the_post_thumbnail_url($post_id, 'large');
    if (!$image_url) {
        $image_url = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400';
    }
    ?>

    <div class="py-20 bg-gray-50 min-h-screen">
        <div class="max-w-6xl mx-auto px-4">
            <div class="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 md:p-12 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start">
                <div class="text-center">
                    <img src="<?php echo esc_url($image_url); ?>" alt="<?php the_title_attribute(); ?>" class="w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-teal-50" />
                    <div class="flex justify-center space-x-3">
                        <a href="<?php echo esc_url($facebook ?: '#'); ?>" class="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors">
                            <i data-lucide="facebook" class="w-4 h-4"></i>
                        </a>
                        <a href="<?php echo esc_url($twitter ?: '#'); ?>" class="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors">
                            <i data-lucide="twitter" class="w-4 h-4"></i>
                        </a>
                        <a href="<?php echo esc_url($linkedin ?: '#'); ?>" class="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors">
                            <i data-lucide="linkedin" class="w-4 h-4"></i>
                        </a>
                    </div>
                </div>
                <div>
                    <p class="text-teal-600 text-xs font-bold uppercase tracking-widest mb-2"><?php echo esc_html($role ?: 'Agent'); ?></p>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"><?php the_title(); ?></h1>
                    <div class="text-gray-600 leading-relaxed mb-8 prose max-w-none">
                        <?php the_content(); ?>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <?php if ($phone) : ?>
                            <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                <p class="font-semibold text-gray-900"><?php echo esc_html($phone); ?></p>
                            </div>
                        <?php endif; ?>
                        <?php if ($email) : ?>
                            <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                                <p class="font-semibold text-gray-900"><?php echo esc_html($email); ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <div class="mt-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Listings by <?php the_title(); ?></h2>
                <?php
                $agent_properties = new WP_Query([
                    'post_type' => 'property',
                    'posts_per_page' => 6,
                    'meta_query' => [
                        [
                            'key' => 'agent_id',
                            'value' => $post_id,
                            'compare' => '='
                        ]
                    ]
                ]);
                if ($agent_properties->have_posts()) :
                    ?>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <?php
                        while ($agent_properties->have_posts()) :
                            $agent_properties->the_post();
                            $prop_id = get_the_ID();
                            $image = get_the_post_thumbnail_url($prop_id, 'large');
                            if (!$image) {
                                $image = HU_THEME_URI . '/assets/img/maitama-ii.jpeg';
                            }
                            ?>
                            <article class="group relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
                                <a href="<?php the_permalink(); ?>" class="absolute inset-0 z-10" aria-label="<?php the_title_attribute(); ?>"></a>
                                <div class="relative aspect-[4/3] overflow-hidden">
                                    <img src="<?php echo esc_url($image); ?>" alt="<?php the_title_attribute(); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-900/10 to-transparent"></div>
                                </div>
                                <div class="relative p-5">
                                    <h3 class="font-bold text-slate-900 text-lg truncate group-hover:text-teal-600 transition-colors"><?php the_title(); ?></h3>
                                </div>
                            </article>
                            <?php
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                <?php else : ?>
                    <div class="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                        <p class="text-gray-500">No listings found for this agent yet.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php
endwhile;

get_footer();
