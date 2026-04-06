<?php
/**
 * Blog index template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$selected_category = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : 'all';
$categories = get_categories(['hide_empty' => true]);
?>

<div class="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
            <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Latest Updates</p>
            <h1 class="text-4xl font-bold text-gray-900">Industry Insights &amp; <span class="text-gray-400 font-light italic">News</span></h1>
        </div>

        <div class="flex flex-wrap justify-center gap-3 mb-12">
            <a class="<?php echo $selected_category === 'all' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'; ?> px-6 py-2 rounded-full text-sm font-medium transition-colors" href="<?php echo esc_url(home_url('/blog')); ?>">
                All Categories
            </a>
            <?php foreach ($categories as $category) : ?>
                <a class="<?php echo $selected_category === $category->slug ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'; ?> px-6 py-2 rounded-full text-sm font-medium transition-colors" href="<?php echo esc_url(add_query_arg('category', $category->slug, home_url('/blog'))); ?>">
                    <?php echo esc_html($category->name); ?>
                </a>
            <?php endforeach; ?>
        </div>

        <?php if (have_posts()) : ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <?php while (have_posts()) : the_post(); ?>
                    <?php
                    $image_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
                    $cat = get_the_category();
                    $cat_name = $cat ? $cat[0]->name : 'News';
                    ?>
                    <article class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all cursor-pointer">
                        <a href="<?php the_permalink(); ?>" class="block">
                            <div class="relative aspect-video overflow-hidden">
                                <?php if ($image_url) : ?>
                                    <img src="<?php echo esc_url($image_url); ?>" alt="<?php the_title_attribute(); ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <?php else : ?>
                                    <div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">No Image</div>
                                <?php endif; ?>
                                <div class="absolute top-4 left-4 bg-teal-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md"><?php echo esc_html(get_the_date()); ?></div>
                            </div>
                            <div class="p-8">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-teal-600 font-bold text-xs uppercase tracking-wider"><?php echo esc_html($cat_name); ?></span>
                                    <span class="text-gray-400 text-[10px] font-medium uppercase"><?php echo esc_html(ceil(str_word_count(strip_tags(get_the_content())) / 200) . ' min read'); ?></span>
                                </div>
                                <h3 class="text-lg font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug"><?php the_title(); ?></h3>
                                <p class="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed"><?php echo esc_html(wp_trim_words(get_the_excerpt() ?: get_the_content(), 30)); ?></p>
                                <span class="text-gray-900 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                    Read More <i data-lucide="arrow-right" class="ml-2 w-4 h-4 text-teal-600"></i>
                                </span>
                            </div>
                        </a>
                    </article>
                <?php endwhile; ?>
            </div>

            <div class="mt-12 flex items-center justify-center gap-2">
                <?php
                the_posts_pagination([
                    'mid_size' => 1,
                    'prev_text' => __('Previous', 'house-unlimited'),
                    'next_text' => __('Next', 'house-unlimited'),
                ]);
                ?>
            </div>
        <?php else : ?>
            <div class="text-center py-16">
                <p class="text-gray-500 text-lg">No blog posts available at the moment.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php
get_footer();
