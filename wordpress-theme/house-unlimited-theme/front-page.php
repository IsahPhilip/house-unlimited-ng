<?php
/**
 * Front page template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$contact_info = hu_get_contact_info();
$hero_badge = function_exists('get_field') ? get_field('hero_badge', 'option') : '';
$hero_title_line1 = function_exists('get_field') ? get_field('hero_title_line1', 'option') : '';
$hero_title_accent = function_exists('get_field') ? get_field('hero_title_accent', 'option') : '';
$hero_description = function_exists('get_field') ? get_field('hero_description', 'option') : '';
$cta_description = function_exists('get_field') ? get_field('cta_description', 'option') : '';
$cta_primary_label = function_exists('get_field') ? get_field('cta_primary_label', 'option') : '';
$testimonials_title = function_exists('get_field') ? get_field('testimonials_title', 'option') : '';

if (!$hero_badge) {
    $hero_badge = 'Find Your Dream Property Easily';
}
if (!$hero_title_line1) {
    $hero_title_line1 = 'Luxury living,';
}
if (!$hero_title_accent) {
    $hero_title_accent = 'redefined for you';
}
if (!$hero_description) {
    $hero_description = 'Discover premium residences curated for modern lifestyles — seamless viewings, trusted guidance, and homes that feel like they were made for you.';
}
if (!$cta_description) {
    $cta_description = "Start your real estate journey today. Whether you're buying or investing, we have the right solution for you.";
}
if (!$cta_primary_label) {
    $cta_primary_label = 'Browse Properties for Sale';
}
if (!$testimonials_title) {
    $testimonials_title = 'What Our Client Say About Us';
}

$default_services = [
    ['title' => 'Buy a Home', 'desc' => 'Find the right home faster with verified listings and guided tours.'],
    ['title' => 'Buy Land', 'desc' => 'Discover verified land parcels with clear documentation and strong value.'],
    ['title' => 'List a Home', 'desc' => 'Showcase your property with professional marketing and trusted guidance.'],
    ['title' => 'Luxury Properties', 'desc' => 'Discreet, curated access to premium homes and estates.'],
    ['title' => 'Investment Sales', 'desc' => 'Identify high-value house and land opportunities with strong upside.'],
];

$default_testimonials = [
    ['name' => 'Jenny Wilson', 'text' => 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.', 'img' => 'https://i.pravatar.cc/150?u=jenny'],
    ['name' => 'Esther Howard', 'text' => 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.', 'img' => 'https://i.pravatar.cc/150?u=esther'],
];

$hero_image = HU_THEME_URI . '/assets/img/maitama-ii.jpeg';
$media_images = [
    HU_THEME_URI . '/assets/img/maitama-ii.jpeg',
    HU_THEME_URI . '/assets/img/maitama-extension.jpeg',
    HU_THEME_URI . '/assets/img/maitama-ii.jpeg',
];
?>

<div class="animate-in fade-in duration-500">
    <section class="relative h-[650px] flex items-center">
        <div class="absolute inset-0 z-0">
            <img src="<?php echo esc_url($hero_image); ?>" alt="Hero" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
        </div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 w-full">
            <div class="max-w-2xl">
                <p class="text-teal-600 font-semibold mb-4 tracking-wide uppercase tracking-[0.2em] text-xs font-bold"><?php echo esc_html($hero_badge); ?></p>
                <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    <?php echo esc_html($hero_title_line1); ?><br />
                    <span class="text-teal-600"><?php echo esc_html($hero_title_accent); ?></span>
                </h1>
                <p class="text-gray-600 text-lg mb-10 max-w-lg"><?php echo esc_html($hero_description); ?></p>

                <div class="bg-white p-2 rounded-2xl shadow-2xl inline-flex flex-col w-full md:w-auto transition-all">
                    <div class="flex p-1">
                        <span class="px-8 py-2.5 rounded-xl font-bold transition-all bg-teal-600 text-white">Buy &amp; Invest</span>
                    </div>
                    <form class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 items-center" method="get" action="<?php echo esc_url(get_post_type_archive_link('property')); ?>">
                        <div class="relative">
                            <p class="text-xs font-bold text-gray-400 uppercase mb-1">Location</p>
                            <input type="text" name="location" placeholder="e.g. Maitama 2, Abuja" class="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full placeholder:text-gray-300" />
                        </div>
                        <div class="border-l border-gray-100 pl-4">
                            <p class="text-xs font-bold text-gray-400 uppercase mb-1">Type</p>
                            <select name="property_type" class="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full cursor-pointer">
                                <option value="">House</option>
                                <option value="land">Land</option>
                            </select>
                        </div>
                        <div class="border-l border-gray-100 pl-4">
                            <p class="text-xs font-bold text-gray-400 uppercase mb-1">Price Range</p>
                            <select name="price_range" class="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full cursor-pointer">
                                <option value="50000000-100000000">N50,000,000 - 100,000,000</option>
                                <option value="150000000-300000000">N150,000,000 - 300,000,000</option>
                                <option value="300000000+">N300,000,000+</option>
                            </select>
                        </div>
                        <button class="bg-teal-600 text-white h-14 w-14 md:w-full rounded-xl flex items-center justify-center font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" type="submit">
                            <span class="hidden md:block">Search</span>
                            <i data-lucide="search" class="md:hidden w-5 h-5"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                <div class="lg:col-span-2">
                    <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Trust &amp; Transparency</p>
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Verified Listings, Clearer Decisions</h2>
                    <p class="text-gray-600 mb-6">We verify identity, ownership, and on-site details before a listing goes live. That means less noise, faster shortlists, and more confident decisions.</p>
                    <div class="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                        <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <span>Verification Coverage</span>
                            <span class="font-bold text-teal-600">98%+</span>
                        </div>
                        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full w-[92%] bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"></div>
                        </div>
                        <p class="text-xs text-gray-500 mt-3">Listings are verified within 48 hours in most cases.</p>
                    </div>
                </div>
                <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <?php
                    $trusted_cards = [
                        ['icon' => 'home', 'label' => 'Verified Owners', 'detail' => 'ID, title & ownership checks'],
                        ['icon' => 'building-2', 'label' => 'On-site Inspection', 'detail' => 'Condition & amenities validated'],
                        ['icon' => 'dollar-sign', 'label' => 'Price Validation', 'detail' => 'Benchmarking vs. market comps'],
                        ['icon' => 'smartphone', 'label' => 'Secure Inquiry', 'detail' => 'Protected messaging and logs'],
                    ];
                    foreach ($trusted_cards as $card) :
                    ?>
                        <div class="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
                            <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                                <i data-lucide="<?php echo esc_attr($card['icon']); ?>" class="w-5 h-5"></i>
                            </div>
                            <div class="text-gray-900 font-bold text-sm mb-1"><?php echo esc_html($card['label']); ?></div>
                            <div class="text-xs text-gray-500"><?php echo esc_html($card['detail']); ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>

    <section class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-wrap items-end justify-between gap-6 mb-8">
                <div>
                    <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Media</p>
                    <h2 class="text-4xl font-bold text-gray-900">Uploaded <span class="text-gray-400 italic font-light">Images &amp; Videos</span></h2>
                    <p class="text-gray-600 mt-3 max-w-2xl">Preview recent uploads from agents and homeowners. Showcasing interiors, walkthroughs, and neighborhood highlights.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php foreach ($media_images as $image) : ?>
                    <div class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                        <div class="relative aspect-[4/3] bg-gray-100">
                            <img src="<?php echo esc_url($image); ?>" alt="Media" class="w-full h-full object-cover" />
                            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700">Image</div>
                        </div>
                        <div class="p-5">
                            <h4 class="font-bold text-gray-900 mb-1">Uploaded media</h4>
                            <p class="text-sm text-gray-500">Uploaded recently</p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 text-center mb-16">
            <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Services</p>
            <h2 class="text-4xl font-bold text-gray-900">Who We <span class="text-gray-400 italic font-light">Serve</span></h2>
            <p class="text-gray-600 mt-3">Expert support for buying and investing in properties.</p>
        </div>
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php
            $service_icons = ['home', 'trees', 'dollar-sign', 'building-2', 'briefcase'];
            if (function_exists('have_rows') && have_rows('services', 'option')) :
                $index = 0;
                while (have_rows('services', 'option')) :
                    the_row();
                    $title = get_sub_field('title') ?: '';
                    $desc = get_sub_field('description') ?: '';
                    $icon = $service_icons[$index % count($service_icons)];
                    $index++;
                    ?>
                    <div class="p-6 rounded-3xl transition-all bg-white border border-gray-100 hover:border-teal-500 hover:shadow-xl">
                        <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                            <i data-lucide="<?php echo esc_attr($icon); ?>" class="w-6 h-6"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 mb-2"><?php echo esc_html($title); ?></h4>
                        <p class="text-sm text-gray-600"><?php echo esc_html($desc); ?></p>
                    </div>
                    <?php
                endwhile;
            else :
                foreach ($default_services as $index => $service) :
                    $icon = $service_icons[$index % count($service_icons)];
                    ?>
                    <div class="p-6 rounded-3xl transition-all bg-white border border-gray-100 hover:border-teal-500 hover:shadow-xl">
                        <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                            <i data-lucide="<?php echo esc_attr($icon); ?>" class="w-6 h-6"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 mb-2"><?php echo esc_html($service['title']); ?></h4>
                        <p class="text-sm text-gray-600"><?php echo esc_html($service['desc']); ?></p>
                    </div>
                    <?php
                endforeach;
            endif;
            ?>
        </div>
    </section>

    <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 flex justify-between items-end mb-12">
            <div>
                <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Featured Listings</p>
                <h2 class="text-4xl font-bold text-gray-900">Discover <span class="text-gray-400 italic font-light">Featured Properties</span></h2>
            </div>
            <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="bg-teal-600 text-white px-8 py-3 rounded-full flex items-center group font-bold text-sm shadow-lg shadow-teal-100">
                Visit All Properties <i data-lucide="arrow-right" class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
            </a>
        </div>
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <?php
            $featured_query = new WP_Query([
                'post_type' => 'property',
                'posts_per_page' => 3,
                'meta_query' => [
                    [
                        'key' => 'featured',
                        'value' => '1',
                        'compare' => '='
                    ]
                ]
            ]);

            if ($featured_query->have_posts()) :
                while ($featured_query->have_posts()) :
                    $featured_query->the_post();
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
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                ?>
                <div class="col-span-full text-center text-gray-500">No featured properties available.</div>
                <?php
            endif;
            ?>
        </div>
    </section>

    <section class="py-24">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Why Choose Us</p>
                <h2 class="text-4xl font-bold text-gray-900">Built to <span class="text-gray-400 italic font-light">Outperform</span></h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <?php
                    $features = [
                        ['icon' => 'map-pin', 'title' => 'Local Market Expertise', 'desc' => 'Neighborhood-level insight that protects your investment.'],
                        ['icon' => 'search', 'title' => 'Data-Driven Pricing', 'desc' => 'Pricing strategies backed by real comps and demand data.'],
                        ['icon' => 'smartphone', 'title' => 'Pro Photography & Marketing', 'desc' => 'High-impact visuals and targeted campaigns that convert.'],
                        ['icon' => 'briefcase', 'title' => 'Strong Negotiation', 'desc' => 'We secure favorable terms without slowing the deal.'],
                        ['icon' => 'star', 'title' => 'Concierge Service', 'desc' => 'Personalized guidance from shortlist to closing.'],
                    ];
                    foreach ($features as $feature) :
                    ?>
                        <div class="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                            <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                                <i data-lucide="<?php echo esc_attr($feature['icon']); ?>" class="w-5 h-5"></i>
                            </div>
                            <h4 class="font-bold text-gray-900 mb-1 text-sm"><?php echo esc_html($feature['title']); ?></h4>
                            <p class="text-xs text-gray-600"><?php echo esc_html($feature['desc']); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="relative bg-teal-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                    <div class="absolute inset-0 opacity-20">
                        <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=800" alt="Happy family" class="w-full h-full object-cover" />
                    </div>
                    <div class="relative z-10">
                        <h3 class="text-3xl font-bold mb-4">A Partner, Not Just a Platform</h3>
                        <p class="text-teal-100 mb-6">We combine market intelligence with hands-on support to help you move faster and smarter.</p>
                        <div class="space-y-3">
                            <div class="flex items-center space-x-3"><span class="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span><span class="text-sm">Verified listings only</span></div>
                            <div class="flex items-center space-x-3"><span class="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span><span class="text-sm">Expert agent support</span></div>
                            <div class="flex items-center space-x-3"><span class="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span><span class="text-sm">Secure transactions</span></div>
                        </div>
                        <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="mt-8 inline-flex bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg">Start Your Search</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">How It Works</p>
                <h2 class="text-4xl font-bold text-gray-900">Simple Steps to <span class="text-gray-400 italic font-light">Your Home</span></h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <?php
                $steps = [
                    ['step' => '01', 'title' => 'Book a consultation', 'text' => 'Tell us your goals and preferred locations.'],
                    ['step' => '02', 'title' => 'Get a custom plan', 'text' => 'We shortlist options tailored to your budget and needs.'],
                    ['step' => '03', 'title' => 'Tour or market homes', 'text' => 'View verified listings or list with pro marketing.'],
                    ['step' => '04', 'title' => 'Close with confidence', 'text' => 'Negotiation, paperwork, and secure closing handled.'],
                ];
                foreach ($steps as $step) :
                ?>
                    <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div class="text-teal-600 text-sm font-bold mb-3">Step <?php echo esc_html($step['step']); ?></div>
                        <h4 class="font-bold text-gray-900 mb-2"><?php echo esc_html($step['title']); ?></h4>
                        <p class="text-sm text-gray-600"><?php echo esc_html($step['text']); ?></p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 text-center mb-16">
            <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Testimonials</p>
            <h2 class="text-4xl font-bold text-gray-900">What Our <span class="text-gray-400 italic font-light font-normal">Client Say About Us</span></h2>
        </div>
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <?php
            if (function_exists('have_rows') && have_rows('testimonials', 'option')) :
                while (have_rows('testimonials', 'option')) :
                    the_row();
                    $quote = get_sub_field('quote') ?: '';
                    $author = get_sub_field('author') ?: '';
                    $role = get_sub_field('role') ?: 'Customer';
                    $image = get_sub_field('image');
                    $image_url = is_array($image) && !empty($image['url']) ? $image['url'] : 'https://i.pravatar.cc/150?u=' . urlencode($author);
                    ?>
                    <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($author); ?>" class="w-20 h-20 rounded-full border-4 border-teal-50 object-cover" />
                        <div class="flex-1">
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <h4 class="font-bold text-gray-900"><?php echo esc_html($author); ?></h4>
                                    <p class="text-gray-400 text-sm"><?php echo esc_html($role); ?></p>
                                </div>
                                <div class="text-teal-200 text-6xl font-serif h-10 overflow-hidden leading-[1]">&quot;</div>
                            </div>
                            <p class="text-gray-600 leading-relaxed italic text-sm">&quot;<?php echo esc_html($quote); ?>&quot;</p>
                            <div class="mt-4 flex text-yellow-400 space-x-1">
                                <?php foreach (str_split('★★★★★') as $star) : ?>
                                    <span class="text-xs"><?php echo esc_html($star); ?></span>
                                <?php endforeach; ?>
                                <span class="text-gray-900 font-bold ml-2 text-xs">5.0</span>
                            </div>
                        </div>
                    </div>
                    <?php
                endwhile;
            else :
                foreach ($default_testimonials as $testimonial) :
                    ?>
                    <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
                        <img src="<?php echo esc_url($testimonial['img']); ?>" alt="<?php echo esc_attr($testimonial['name']); ?>" class="w-20 h-20 rounded-full border-4 border-teal-50 object-cover" />
                        <div class="flex-1">
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <h4 class="font-bold text-gray-900"><?php echo esc_html($testimonial['name']); ?></h4>
                                    <p class="text-gray-400 text-sm">Customer</p>
                                </div>
                                <div class="text-teal-200 text-6xl font-serif h-10 overflow-hidden leading-[1]">&quot;</div>
                            </div>
                            <p class="text-gray-600 leading-relaxed italic text-sm">&quot;<?php echo esc_html($testimonial['text']); ?>&quot;</p>
                            <div class="mt-4 flex text-yellow-400 space-x-1">
                                <?php foreach (str_split('★★★★★') as $star) : ?>
                                    <span class="text-xs"><?php echo esc_html($star); ?></span>
                                <?php endforeach; ?>
                                <span class="text-gray-900 font-bold ml-2 text-xs">5.0</span>
                            </div>
                        </div>
                    </div>
                    <?php
                endforeach;
            endif;
            ?>
        </div>
    </section>

    <section class="py-16 bg-teal-600 text-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="bg-teal-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div class="absolute inset-0 opacity-10">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" alt="Background" class="w-full h-full object-cover" />
                </div>
                <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
                        <p class="text-teal-100 mb-6 max-w-lg"><?php echo esc_html($cta_description); ?></p>
                        <div class="flex flex-wrap gap-4">
                            <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="bg-white text-teal-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg">
                                <?php echo esc_html($cta_primary_label); ?>
                            </a>
                        </div>
                    </div>
                    <div class="flex justify-center lg:justify-end">
                        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                            <div class="flex items-center space-x-4 mb-4">
                                <div class="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
                                    <i data-lucide="phone" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <p class="text-white/80 text-sm">Contact our team</p>
                                    <p class="font-bold text-lg"><?php echo esc_html($contact_info['phone']); ?></p>
                                </div>
                            </div>
                            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="w-full inline-flex justify-center bg-white text-teal-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">Get in Touch</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<?php
get_footer();
?>
