<?php
/**
 * Single post template.
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
    $image_url = get_the_post_thumbnail_url($post_id, 'full');
    $cat = get_the_category();
    $cat_name = $cat ? $cat[0]->name : 'News';
    $author_name = get_the_author();
    $author_avatar = get_avatar_url(get_the_author_meta('ID'), ['size' => 96]);
    ?>

    <div class="bg-white min-h-screen animate-in fade-in duration-500">
        <div class="relative h-[400px] md:h-[500px]">
            <?php if ($image_url) : ?>
                <img src="<?php echo esc_url($image_url); ?>" alt="<?php the_title_attribute(); ?>" class="w-full h-full object-cover" />
            <?php else : ?>
                <div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">No Image</div>
            <?php endif; ?>
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="max-w-4xl px-4 text-center">
                    <span class="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block shadow-lg"><?php echo esc_html($cat_name); ?></span>
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg"><?php the_title(); ?></h1>
                    <div class="mt-8 flex items-center justify-center space-x-4 text-white/90">
                        <div class="flex items-center space-x-2">
                            <?php if ($author_avatar) : ?>
                                <img src="<?php echo esc_url($author_avatar); ?>" class="w-8 h-8 rounded-full border-2 border-white/20" />
                            <?php endif; ?>
                            <span class="font-bold text-sm"><?php echo esc_html($author_name); ?></span>
                        </div>
                        <span class="text-white/40">•</span>
                        <span class="text-sm font-medium"><?php echo esc_html(get_the_date()); ?></span>
                        <span class="text-white/40">•</span>
                        <span class="text-sm font-medium"><?php echo esc_html(ceil(str_word_count(strip_tags(get_the_content())) / 200) . ' min read'); ?></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-16">
            <div class="hidden lg:block lg:col-span-1">
                <div class="sticky top-32 space-y-8">
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Share Article</h4>
                        <div class="flex flex-col space-y-4">
                            <button class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                                <i data-lucide="facebook" class="w-5 h-5"></i>
                            </button>
                            <button class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-400 hover:text-white transition-all shadow-sm">
                                <i data-lucide="twitter" class="w-5 h-5"></i>
                            </button>
                            <button class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-700 hover:text-white transition-all shadow-sm">
                                <i data-lucide="linkedin" class="w-5 h-5"></i>
                            </button>
                            <button class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                <i data-lucide="link-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2">
                <article class="prose prose-lg prose-slate max-w-none">
                    <?php the_content(); ?>
                </article>

                <div class="mt-12">
                    <?php if (comments_open() || get_comments_number()) : ?>
                        <?php comments_template(); ?>
                    <?php endif; ?>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="sticky top-32">
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Related Articles</h4>
                    <div class="space-y-8">
                        <?php
                        $related = new WP_Query([
                            'post_type' => 'post',
                            'posts_per_page' => 3,
                            'post__not_in' => [$post_id],
                            'category__in' => wp_get_post_categories($post_id),
                        ]);
                        if ($related->have_posts()) :
                            while ($related->have_posts()) :
                                $related->the_post();
                                $related_image = get_the_post_thumbnail_url(get_the_ID(), 'large');
                                ?>
                                <div class="group cursor-pointer">
                                    <a href="<?php the_permalink(); ?>">
                                        <div class="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm">
                                            <?php if ($related_image) : ?>
                                                <img src="<?php echo esc_url($related_image); ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <?php else : ?>
                                                <div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] uppercase tracking-widest">No Image</div>
                                            <?php endif; ?>
                                        </div>
                                        <h5 class="font-bold text-gray-900 text-sm leading-snug group-hover:text-teal-600 transition-colors"><?php the_title(); ?></h5>
                                        <p class="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider"><?php echo esc_html(get_the_date()); ?></p>
                                    </a>
                                </div>
                                <?php
                            endwhile;
                            wp_reset_postdata();
                        else :
                            ?>
                            <p class="text-sm text-gray-500">No related articles yet.</p>
                            <?php
                        endif;
                        ?>
                    </div>

                    <div class="mt-12 bg-teal-600 rounded-3xl p-8 text-white">
                        <h4 class="text-lg font-bold mb-4">Want more insights?</h4>
                        <p class="text-teal-100 text-xs leading-relaxed mb-6">Join 50,000+ home buyers receiving our weekly market reports and design tips.</p>
                        <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post" class="space-y-3">
                            <?php wp_nonce_field('hu_newsletter_subscribe', 'hu_newsletter_nonce'); ?>
                            <input type="hidden" name="action" value="hu_newsletter_subscribe">
                            <input type="email" name="newsletter_email" placeholder="Email address" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-teal-200 focus:ring-2 focus:ring-white outline-none" />
                            <button type="submit" class="w-full bg-white text-teal-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Subscribe</button>
                        </form>
                        <?php if (!empty($_GET['newsletter'])) : ?>
                            <?php
                            $newsletter_status = sanitize_text_field($_GET['newsletter']);
                            $newsletter_message = '';
                            if ($newsletter_status === 'success') {
                                $newsletter_message = 'Thanks for subscribing.';
                            } elseif ($newsletter_status === 'exists') {
                                $newsletter_message = 'You are already subscribed.';
                            } elseif ($newsletter_status === 'invalid') {
                                $newsletter_message = 'Please enter a valid email.';
                            } elseif ($newsletter_status === 'security') {
                                $newsletter_message = 'Security check failed. Please try again.';
                            } else {
                                $newsletter_message = 'Unable to subscribe right now.';
                            }
                            ?>
                            <p class="text-xs text-teal-100 mt-3"><?php echo esc_html($newsletter_message); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php
endwhile;

get_footer();
