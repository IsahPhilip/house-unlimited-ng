<?php
/**
 * Property archive template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$location = isset($_GET['location']) ? sanitize_text_field($_GET['location']) : '';
$property_type = isset($_GET['property_type']) ? sanitize_text_field($_GET['property_type']) : '';
$property_status = isset($_GET['property_status']) ? sanitize_text_field($_GET['property_status']) : '';
$price_range = isset($_GET['price_range']) ? sanitize_text_field($_GET['price_range']) : '';
?>

<div class="py-16 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-7xl mx-auto px-4">
        <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 class="text-4xl font-bold text-gray-900 mb-2">
                    <?php echo esc_html($location || $property_type || $property_status || $price_range ? 'Search Results' : 'Browse Our Listings'); ?>
                </h1>
                <?php if ($location || $property_type || $property_status || $price_range) : ?>
                    <p class="text-gray-500">
                        Showing results for <?php echo esc_html($location ?: 'Any location'); ?>
                        • <?php echo esc_html($property_type ?: 'Any type'); ?>
                        • <?php echo esc_html($price_range ?: 'Any price'); ?>
                    </p>
                <?php endif; ?>
            </div>
            <div class="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                <button type="button" data-view="grid" class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center bg-teal-600 text-white shadow-md">
                    <span class="mr-2 text-base">⊞</span> Grid
                </button>
                <button type="button" data-view="map" class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center text-gray-500 hover:text-teal-600">
                    <span class="mr-2 text-base">🗺</span> Map
                </button>
            </div>
        </div>

        <form class="flex flex-col md:flex-row justify-between mb-8 gap-4 items-center" method="get" action="<?php echo esc_url(get_post_type_archive_link('property')); ?>">
            <div class="flex flex-wrap gap-3 items-center">
                <input type="text" name="location" value="<?php echo esc_attr($location); ?>" placeholder="Location" class="bg-white border border-gray-100 rounded-xl px-4 py-2 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-teal-600 shadow-sm">
                <select name="property_type" class="bg-white border border-gray-100 rounded-xl px-4 py-2 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-teal-600 shadow-sm">
                    <option value=""><?php esc_html_e('All Types', 'house-unlimited'); ?></option>
                    <?php
                    $types = get_terms(['taxonomy' => 'property_type', 'hide_empty' => false]);
                    foreach ($types as $type) {
                        echo '<option value="' . esc_attr($type->slug) . '" ' . selected($property_type, $type->slug, false) . '>' . esc_html($type->name) . '</option>';
                    }
                    ?>
                </select>
                <select name="property_status" class="bg-white border border-gray-100 rounded-xl px-4 py-2 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-teal-600 shadow-sm">
                    <option value=""><?php esc_html_e('All Statuses', 'house-unlimited'); ?></option>
                    <?php
                    $statuses = get_terms(['taxonomy' => 'property_status', 'hide_empty' => false]);
                    foreach ($statuses as $status) {
                        echo '<option value="' . esc_attr($status->slug) . '" ' . selected($property_status, $status->slug, false) . '>' . esc_html($status->name) . '</option>';
                    }
                    ?>
                </select>
                <select name="price_range" class="bg-white border border-gray-100 rounded-xl px-4 py-2 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-teal-600 shadow-sm">
                    <option value=""><?php esc_html_e('Any Price', 'house-unlimited'); ?></option>
                    <option value="50000000-100000000" <?php selected($price_range, '50000000-100000000'); ?>>N50,000,000 - 100,000,000</option>
                    <option value="150000000-300000000" <?php selected($price_range, '150000000-300000000'); ?>>N150,000,000 - 300,000,000</option>
                    <option value="300000000+" <?php selected($price_range, '300000000+'); ?>>N300,000,000+</option>
                </select>
                <button class="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" type="submit">
                    Search
                </button>
            </div>

            <div class="flex items-center space-x-4">
                <span class="text-sm font-medium text-gray-500">
                    <?php
                    global $wp_query;
                    echo esc_html(number_format_i18n($wp_query->found_posts) . ' Results found');
                    ?>
                </span>
            </div>
        </form>

        <div id="hu-property-grid">
            <?php if (have_posts()) : ?>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <?php
                    while (have_posts()) :
                        the_post();
                        $post_id = get_the_ID();
                        $address = get_post_meta($post_id, 'address', true);
                        $beds = get_post_meta($post_id, 'beds', true);
                        $baths = get_post_meta($post_id, 'baths', true);
                        $sqft = get_post_meta($post_id, 'sqft', true);
                        $type_terms = wp_get_post_terms($post_id, 'property_type');
                        $status_terms = wp_get_post_terms($post_id, 'property_status');
                        $type_label = $type_terms && !is_wp_error($type_terms) ? $type_terms[0]->name : 'House';
                        $status_label = $status_terms && !is_wp_error($status_terms) ? $status_terms[0]->name : 'For Sale';
                        $image_url = get_the_post_thumbnail_url($post_id, 'large');
                        if (!$image_url) {
                            $image_url = HU_THEME_URI . '/assets/img/maitama-ii.jpeg';
                        }
                        ?>
                        <article class="group relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]">
                            <a href="<?php the_permalink(); ?>" class="absolute inset-0 z-10" aria-label="<?php the_title_attribute(); ?>"></a>
                            <div class="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative aspect-[4/3] overflow-hidden">
                                <img src="<?php echo esc_url($image_url); ?>" alt="<?php the_title_attribute(); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-900/10 to-transparent"></div>
                                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                                    <span class="px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-teal-100 text-teal-800"><?php echo esc_html($status_label); ?></span>
                                    <span class="px-3 py-1 bg-white/90 text-slate-900 rounded-full text-xs font-bold shadow-lg"><?php echo esc_html($type_label); ?></span>
                                </div>
                            </div>
                            <div class="relative p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <h3 class="font-bold text-slate-900 text-lg truncate group-hover:text-teal-600 transition-colors"><?php the_title(); ?></h3>
                                    <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Featured</span>
                                </div>
                                <p class="text-slate-600 text-sm mb-4 flex items-center">
                                    <i data-lucide="map-pin" class="w-4 h-4 mr-1 text-teal-500"></i>
                                    <?php echo esc_html($address); ?>
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
                                        <i data-lucide="bed" class="w-3.5 h-3.5"></i> <?php echo esc_html($beds ?: '0'); ?> Beds
                                    </span>
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-teal-600 text-white px-3 py-1 text-xs font-semibold">
                                        <i data-lucide="bath" class="w-3.5 h-3.5"></i> <?php echo esc_html($baths ?: '0'); ?> Baths
                                    </span>
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-teal-100 text-teal-800 px-3 py-1 text-xs font-semibold">
                                        <i data-lucide="ruler" class="w-3.5 h-3.5"></i> <?php echo esc_html($sqft ?: '0'); ?> sqft
                                    </span>
                                </div>
                            </div>
                        </article>
                    <?php endwhile; ?>
                </div>
            <?php else : ?>
                <div class="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                    <div class="text-6xl mb-6">🏜️</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">No matching properties found</h3>
                    <p class="text-gray-500 mb-8">Try adjusting your filters or search location to find what you're looking for.</p>
                    <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="text-teal-600 font-bold hover:underline">Reset all filters</a>
                </div>
            <?php endif; ?>
        </div>

        <div id="hu-property-map" class="hidden animate-in fade-in duration-700">
            <div class="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <div class="text-5xl mb-4">🗺️</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Map view coming soon</h3>
                <p class="text-gray-500 text-sm">We are preparing the interactive map once property coordinates are available.</p>
            </div>
        </div>

        <?php
        if (function_exists('the_posts_pagination')) {
            the_posts_pagination([
                'mid_size' => 1,
                'prev_text' => __('Previous', 'house-unlimited'),
                'next_text' => __('Next', 'house-unlimited'),
            ]);
        }
        ?>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('hu-property-grid');
    var map = document.getElementById('hu-property-map');
    document.querySelectorAll('[data-view]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var view = btn.getAttribute('data-view');
            document.querySelectorAll('[data-view]').forEach(function (b) {
                b.classList.remove('bg-teal-600', 'text-white', 'shadow-md');
                b.classList.add('text-gray-500');
            });
            btn.classList.add('bg-teal-600', 'text-white', 'shadow-md');
            btn.classList.remove('text-gray-500');
            if (view === 'map') {
                grid.classList.add('hidden');
                map.classList.remove('hidden');
            } else {
                map.classList.add('hidden');
                grid.classList.remove('hidden');
            }
        });
    });
});
</script>

<?php
get_footer();
