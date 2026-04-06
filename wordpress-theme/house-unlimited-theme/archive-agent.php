<?php
/**
 * Agents archive template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>

<div class="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
            <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Meet our experts</p>
            <h1 class="text-4xl font-bold text-gray-900">Our Professional <span class="text-gray-400 font-light italic">Agents</span></h1>
        </div>

        <?php if (have_posts()) : ?>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <?php
                while (have_posts()) :
                    the_post();
                    $post_id = get_the_ID();
                    $role = get_post_meta($post_id, 'role', true);
                    $linkedin = get_post_meta($post_id, 'linkedin', true);
                    $twitter = get_post_meta($post_id, 'twitter', true);
                    $facebook = get_post_meta($post_id, 'facebook', true);
                    $image_url = get_the_post_thumbnail_url($post_id, 'large');
                    if (!$image_url) {
                        $image_url = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400';
                    }
                    ?>
                    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all group">
                        <a href="<?php the_permalink(); ?>" class="block">
                            <img src="<?php echo esc_url($image_url); ?>" alt="<?php the_title_attribute(); ?>" class="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-teal-50" />
                            <h4 class="text-xl font-bold text-gray-900"><?php the_title(); ?></h4>
                            <p class="text-teal-600 text-xs font-bold uppercase tracking-widest mt-1 mb-6"><?php echo esc_html($role ?: 'Agent'); ?></p>
                        </a>
                        <div class="flex justify-center space-x-3">
                            <a href="<?php echo esc_url($facebook ?: '#'); ?>" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors">
                                <i data-lucide="facebook" class="w-4 h-4"></i>
                            </a>
                            <a href="<?php echo esc_url($twitter ?: '#'); ?>" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors">
                                <i data-lucide="twitter" class="w-4 h-4"></i>
                            </a>
                            <a href="<?php echo esc_url($linkedin ?: '#'); ?>" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors">
                                <i data-lucide="linkedin" class="w-4 h-4"></i>
                            </a>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
        <?php else : ?>
            <div class="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                <div class="text-6xl mb-6">👥</div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">No agents found</h3>
                <p class="text-gray-500 mb-8">Agents will appear here once they are added.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php
get_footer();
