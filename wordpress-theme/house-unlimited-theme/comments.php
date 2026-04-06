<?php
/**
 * Comments template.
 *
 * @package HouseUnlimited
 */

if (post_password_required()) {
    return;
}

$comment_count = get_comments_number();
?>

<section id="comments" class="hu-comments bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-12">
    <h3 class="text-xl font-bold text-gray-900 mb-6">
        <?php
        if ($comment_count === 1) {
            echo '1 Comment';
        } else {
            echo esc_html(number_format_i18n($comment_count)) . ' Comments';
        }
        ?>
    </h3>

    <?php if (have_comments()) : ?>
        <ol class="hu-comments__list space-y-6 mb-10">
            <?php
            wp_list_comments([
                'style' => 'ol',
                'short_ping' => true,
                'avatar_size' => 56,
            ]);
            ?>
        </ol>
    <?php else : ?>
        <p class="text-gray-500 mb-10">Be the first to comment on this article.</p>
    <?php endif; ?>

    <?php if (comments_open()) : ?>
        <?php
        comment_form([
            'class_form' => 'hu-comment-form space-y-6',
            'title_reply' => 'Leave a Comment',
            'title_reply_before' => '<h4 class="text-lg font-bold text-gray-900 mb-4">',
            'title_reply_after' => '</h4>',
            'comment_field' => '<div><label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="comment">Comment</label><textarea id="comment" name="comment" rows="5" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"></textarea></div>',
            'fields' => [
                'author' => '<div><label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="author">Name</label><input id="author" name="author" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"></div>',
                'email' => '<div><label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="email">Email</label><input id="email" name="email" type="email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"></div>',
                'url' => '<div><label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="url">Website</label><input id="url" name="url" type="url" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"></div>',
            ],
            'submit_button' => '<button type="submit" class="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all">%4$s</button>',
            'class_submit' => 'hu-comment-submit',
            'comment_notes_before' => '<p class="text-sm text-gray-500">Your email address will not be published. Required fields are marked *</p>',
        ]);
        ?>
    <?php endif; ?>
</section>
