<?php
/**
 * Property single template.
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
    $price = get_post_meta($post_id, 'price', true);
    $address = get_post_meta($post_id, 'address', true);
    $beds = get_post_meta($post_id, 'beds', true);
    $baths = get_post_meta($post_id, 'baths', true);
    $sqft = get_post_meta($post_id, 'sqft', true);
    $year_built = get_post_meta($post_id, 'year_built', true);
    $lot_size = get_post_meta($post_id, 'lot_size', true);
    $parking = get_post_meta($post_id, 'parking', true);
    $amenities = get_post_meta($post_id, 'amenities', true);
    $gallery = get_post_meta($post_id, 'gallery', true);

    $type_terms = wp_get_post_terms($post_id, 'property_type');
    $status_terms = wp_get_post_terms($post_id, 'property_status');
    $type_label = $type_terms && !is_wp_error($type_terms) ? $type_terms[0]->name : 'House';
    $status_label = $status_terms && !is_wp_error($status_terms) ? $status_terms[0]->name : 'For Sale';

    $gallery_ids = [];
    if (is_array($gallery)) {
        $gallery_ids = $gallery;
    } elseif (is_string($gallery) && $gallery !== '') {
        $gallery_ids = array_map('intval', explode(',', $gallery));
    }

    $gallery_urls = [];
    if (has_post_thumbnail()) {
        $gallery_urls[] = get_the_post_thumbnail_url($post_id, 'large');
    }
    foreach ($gallery_ids as $image_id) {
        $url = wp_get_attachment_image_url($image_id, 'large');
        if ($url) {
            $gallery_urls[] = $url;
        }
    }
    if (!$gallery_urls) {
        $gallery_urls[] = HU_THEME_URI . '/assets/img/maitama-ii.jpeg';
    }

    $amenity_list = [];
    if ($amenities) {
        $amenity_list = array_filter(array_map('trim', preg_split('/[\r\n,]+/', $amenities)));
    }
    ?>

    <div class="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
        <div class="bg-white/80 backdrop-blur border-b border-white">
            <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 text-sm text-gray-600">
                <div class="flex items-center space-x-2">
                    <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="hover:text-teal-600 transition-colors font-medium">
                        <span class="inline-flex items-center gap-2">
                            <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Properties
                        </span>
                    </a>
                    <span class="text-gray-300">/</span>
                    <span class="font-medium text-gray-900 truncate max-w-[300px]"><?php the_title(); ?></span>
                </div>
            </div>
        </div>

        <main class="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-10">
            <section class="bg-white rounded-[28px] border border-white/80 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 p-2">
                    <div class="relative aspect-[16/11] md:aspect-[16/10] rounded-2xl overflow-hidden">
                        <img src="<?php echo esc_url($gallery_urls[0]); ?>" alt="<?php the_title_attribute(); ?>" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <?php foreach (array_slice($gallery_urls, 1, 4) as $image) : ?>
                            <div class="relative aspect-[1/1] rounded-2xl overflow-hidden border-2 border-transparent">
                                <img src="<?php echo esc_url($image); ?>" alt="" class="w-full h-full object-cover" />
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php if (count($gallery_urls) > 1) : ?>
                    <div class="flex gap-3 overflow-x-auto px-4 pb-4 pt-2">
                        <?php foreach ($gallery_urls as $image) : ?>
                            <div class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent">
                                <img src="<?php echo esc_url($image); ?>" alt="" class="w-full h-full object-cover" />
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </section>

            <section class="bg-white rounded-[32px] border border-white/80 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] p-6 md:p-8">
                <div class="flex flex-wrap items-start justify-between gap-6">
                    <div class="min-w-[260px]">
                        <div class="flex flex-wrap gap-3 mb-4">
                            <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-teal-100 text-teal-800"><?php echo esc_html($status_label); ?></span>
                            <span class="px-4 py-1.5 bg-white text-slate-700 rounded-full text-xs font-semibold border border-slate-200"><?php echo esc_html($type_label); ?></span>
                        </div>
                        <h1 class="text-3xl md:text-5xl font-bold text-slate-950 tracking-tight mb-3"><?php the_title(); ?></h1>
                        <p class="text-slate-700 flex items-center text-lg">
                            <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-teal-600"></i>
                            <?php echo esc_html($address); ?>
                        </p>
                        <?php if ($price) : ?>
                            <p class="text-2xl font-bold text-teal-600 mt-4"><?php echo esc_html($price); ?></p>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                    <?php
                    $stats = [
                        ['icon' => 'bed', 'label' => 'Bedrooms', 'value' => $beds ?: '0'],
                        ['icon' => 'bath', 'label' => 'Bathrooms', 'value' => $baths ?: '0'],
                        ['icon' => 'ruler', 'label' => 'Sqft', 'value' => $sqft ?: '0'],
                        ['icon' => 'home', 'label' => 'Type', 'value' => $type_label],
                    ];
                    foreach ($stats as $stat) :
                    ?>
                        <div class="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                            <div class="w-11 h-11 rounded-xl bg-white text-teal-600 flex items-center justify-center shadow-sm">
                                <i data-lucide="<?php echo esc_attr($stat['icon']); ?>" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <div class="text-xl font-bold text-slate-950"><?php echo esc_html($stat['value']); ?></div>
                                <div class="text-xs text-slate-500"><?php echo esc_html($stat['label']); ?></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div class="lg:col-span-2 space-y-10">
                    <section class="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
                        <div class="flex items-center justify-between mb-5">
                            <h2 class="text-2xl font-bold">Overview</h2>
                        </div>
                        <div class="text-slate-700 leading-relaxed text-lg prose max-w-none">
                            <?php the_content(); ?>
                        </div>
                    </section>

                    <?php if ($amenity_list) : ?>
                        <section class="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
                            <h2 class="text-2xl font-bold mb-6">Amenities</h2>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
                                <?php foreach ($amenity_list as $amenity) : ?>
                                    <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                                        <div class="text-teal-600"><i data-lucide="check" class="w-5 h-5"></i></div>
                                        <span class="font-medium"><?php echo esc_html($amenity); ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </section>
                    <?php endif; ?>

                    <section class="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
                        <h2 class="text-2xl font-bold mb-6">Property Specifications</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <?php if ($year_built) : ?>
                                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                                    <div>
                                        <span class="text-sm text-gray-500">Year Built</span>
                                        <p class="font-bold text-lg"><?php echo esc_html($year_built); ?></p>
                                    </div>
                                    <div class="text-2xl text-teal-600"><i data-lucide="home" class="w-6 h-6"></i></div>
                                </div>
                            <?php endif; ?>
                            <?php if ($lot_size) : ?>
                                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                                    <div>
                                        <span class="text-sm text-gray-500">Lot Size</span>
                                        <p class="font-bold text-lg"><?php echo esc_html($lot_size); ?></p>
                                    </div>
                                    <div class="text-2xl text-teal-600"><i data-lucide="ruler" class="w-6 h-6"></i></div>
                                </div>
                            <?php endif; ?>
                            <?php if ($parking) : ?>
                                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                                    <div>
                                        <span class="text-sm text-gray-500">Parking Spaces</span>
                                        <p class="font-bold text-lg"><?php echo esc_html($parking); ?></p>
                                    </div>
                                    <div class="text-2xl text-teal-600"><i data-lucide="car" class="w-6 h-6"></i></div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </section>
                </div>

                <aside class="lg:col-span-1">
                    <div class="sticky top-6 space-y-8">
                        <div class="bg-white rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] overflow-hidden border border-white/80">
                            <div class="p-6 md:p-8">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-xl md:text-2xl font-bold">Contact Agent</h3>
                                </div>
                                <form method="post" class="space-y-5">
                                    <?php wp_nonce_field('hu_property_inquiry', 'hu_property_inquiry_nonce'); ?>
                                    <input type="hidden" name="hu_property_id" value="<?php echo esc_attr($post_id); ?>">
                                    <input name="name" placeholder="Full Name" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" required>
                                    <input name="email" type="email" placeholder="Email Address" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" required>
                                    <textarea name="message" rows="4" placeholder="I'm interested in this property..." class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"></textarea>
                                    <button type="submit" class="w-full py-4 px-6 rounded-xl font-medium text-white bg-teal-600 hover:bg-teal-700 transition-all">Send Inquiry</button>
                                </form>
                            </div>
                        </div>

                        <div class="bg-gradient-to-br from-teal-600 via-teal-500 to-slate-700 text-white rounded-[28px] p-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.9)]">
                            <h4 class="text-lg font-semibold mb-5 opacity-90">Listed by</h4>
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center text-2xl font-bold">LA</div>
                                <div>
                                    <p class="font-bold text-lg">Leslie Alexander</p>
                                    <p class="text-teal-100 text-sm">Senior Property Consultant</p>
                                </div>
                            </div>
                            <div class="space-y-3 text-sm">
                                <a href="<?php echo esc_url(home_url('/contact')); ?>" class="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                                    <i data-lucide="calendar" class="w-4 h-4"></i> Schedule Viewing
                                </a>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    </div>

    <?php
endwhile;

get_footer();
